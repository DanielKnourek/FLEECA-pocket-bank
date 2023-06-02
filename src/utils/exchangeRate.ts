import { env } from "@/env.mjs";
import { Database } from "@/server/db/db-schema";
import { dsvFormat } from 'd3-dsv';
import { Insertable } from "kysely";
import { z } from "zod";
import { toZod } from 'tozod'
import { db, useDB } from "@/server/db";

/**
 * Finds and returns latest cached ExchangeRate if exchangeRate is older than 12h it tries to download and update database.
 * @param currencyCode usally 3 letter abbriviation of a requested currency
 * @returns Schema Selectable<Database['ExchangeRate']> or Array<Selectable<Database['ExchangeRate']>> if param currencyCode is undefined
 */
const getExchangeRate = (currencyCode: string) => {
    return getSpecificExchangeRate(currencyCode);

}

const isLessThanXhours = (date: Date, Xtimes: number): boolean => {
    return ((Date.now() - date.getTime()) < (Xtimes * 3_600_00)); // 1h*60m*60s*1000ms
}

const getAllExchangeRates = async () => {
    let selectResult = await getAllStoredExchangeRates();

    if (selectResult !== undefined && selectResult[0] !== undefined && isLessThanXhours(selectResult[0].created_at, 12)) {
        return selectResult;
    }

    await updateExchangeRateRecord();

    selectResult = await getAllStoredExchangeRates();
    return selectResult;
}

const getSpecificExchangeRate = async (currencyCode: string) => {
    let selectResult = await getStoredExchangeRate(currencyCode);

    if (selectResult !== undefined && isLessThanXhours(selectResult.created_at, 12)) {
        return selectResult;
    }

    await updateExchangeRateRecord();

    selectResult = await getStoredExchangeRate(currencyCode);
    return selectResult;
}

const updateExchangeRateRecord = () => {
    return DowloadAndParseDSV()
        .then(newExchangeRate => {
            return useDB.insertInto('ExchangeRate')
                .values(newExchangeRate)
                .execute();
        });
}

const getAllStoredExchangeRates = () => {
    return useDB.selectFrom('ExchangeRate')
        .select([
            'ExchangeRate.currency_code',
            db.fn.max('created_at').as('created_at'),
            'ExchangeRate.country',
            'ExchangeRate.currency_name'
        ])
        .groupBy([
            'ExchangeRate.currency_code',
            'ExchangeRate.country',
            'ExchangeRate.currency_name'
        ])
        .execute();
}

const getStoredExchangeRate = (currencyCode: string) => {
    return useDB.selectFrom('ExchangeRate').selectAll()
        .where('currency_code', '=', currencyCode)
        .orderBy('ExchangeRate.created_at', 'desc')
        .limit(1)
        .executeTakeFirst();

}

const parseFloatComma = (input: string | undefined) => {
    return parseFloat(`${input}`.replace(/\./g, '').replace(',', '.'));
}

const ExchangeRateSchema: toZod<Insertable<Database["ExchangeRate"]>> = z.object({
    country: z.string(),
    currency_name: z.string(),
    qty_ammout: z.number(),
    price_ammout: z.number(),
    currency_code: z.string(),
    created_at: z.date().optional(),
})

const DowloadAndParseDSV = async () => {
    let dowloadDate: String;
    const result = await fetch(`${env.CNB_EXCHANGERATE_URI}`)
        .then(res => {
            return res.text();
        })
        .then(text => {
            let firstlineEnd = text.indexOf('\n');
            dowloadDate = text.substring(0, firstlineEnd - 1)
            return dsvFormat('|').parse(text.substring(firstlineEnd + 1))
        })
        .then(dsv => {

            return ExchangeRateSchema.array().parseAsync(dsv.map(row => {
                return {
                    country: row["země"],
                    currency_name: row["měna"],
                    qty_ammout: parseFloatComma(row["množství"]),
                    currency_code: row["kód"],
                    price_ammout: parseFloatComma(row["kurz"]),
                }
            }))
        })
    result.push({
        country: "Česká republika",
        currency_code: "CZK",
        currency_name: "Česká koruna",
        price_ammout: 1,
        qty_ammout: 1,
    })
    return result;
}

const fn = {
    isLessThanXhours,
    getAllExchangeRates,
    getSpecificExchangeRate,
    updateExchangeRateRecord,
    getAllStoredExchangeRates,
    getStoredExchangeRate,
    parseFloatComma,
    ExchangeRateSchema,
    DowloadAndParseDSV,
    getExchangeRate,
}

export default fn;
export { getExchangeRate, getAllExchangeRates }