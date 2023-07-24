import type { Database } from "@/server/db/db-schema";
import type { toZod } from "tozod";

import { z } from "zod";

type currencyExchange = {
    source_currency_code: Required<Database["ExchangeRate"]['currency_code']>
    target_currency_code: Required<Database["ExchangeRate"]['currency_code']>
    source_amount: number,
    target_amount?: number,
}

const currencyExchangeSchema: toZod<currencyExchange> = z.object({
    source_currency_code: z.string(),
    target_currency_code: z.string(),
    source_amount: z.number(),
    target_amount: z.number().optional(),
})

export type { currencyExchange }
export { currencyExchangeSchema }