import { newBankAccountClientSchema, type newBankAccountClientType } from "@/types/bankAccount";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AsyncSelect from 'react-select/async';
import { SubmitWithState } from "./SubmitWithState";


const CreateBankAccountForm = () => {
    const { handleSubmit, formState: { errors }, control } = useForm<newBankAccountClientType>({ resolver: zodResolver(newBankAccountClientSchema) });

    const listOfCurrencies = api.exchangeRate.listCurrencies.useQuery(undefined, { staleTime: 15 * 60 * 1000 });
    const createBankAccount = api.bankAccount.createAccount.useMutation();

    const [formSubmitState, setFormSubmitState] = useState<('submit' | 'loading' | 'success' | 'error' | undefined)>(undefined);

    const createBankAccountSubmit = async (data: newBankAccountClientType) => {
        setFormSubmitState('loading');

        const res = await createBankAccount.mutateAsync(data);
        if (res.success) {
            setFormSubmitState('success');
        }
        else {
            setFormSubmitState('error');
        }
    }
    type selectCurrencyList = { value: string, label: string }[];

    const searchCurrency = (inputValue: string) => {
        return new Promise<selectCurrencyList>((resolve) => {
            if (!listOfCurrencies.data) {
                resolve([]);
                return;
            }
            const filteredlist = listOfCurrencies.data?.list
                .reduce((filtered, currency) => {
                    const label = `[${currency.currency_code}] - ${currency.currency_name} (${currency.country})`;
                    if (label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())) {
                        filtered.push({
                            value: currency.currency_code,
                            label,
                        })
                    }
                    return filtered;
                }, [] as selectCurrencyList)
            resolve(filteredlist)
        });
    }

    return (
        <section className="p-1"
            title="Create new bank account."
        >
            <form className="flex flex-col bg-primary rounded-t-xl rounded-b-xl m-2"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onSubmit={handleSubmit(createBankAccountSubmit)}
            >
                <div className="p-2 w-full flex flex-col">
                    <div>
                        <label className="m-2 font-bold">
                            new account currency
                        </label>
                        {errors.currency_code && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.currency_code.message}</span>}
                    </div>
                    {
                        !!listOfCurrencies?.data ?
                            <Controller
                                name="currency_code"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                    <AsyncSelect cacheOptions
                                        defaultOptions
                                        instanceId={"currency_code_select_newBankAccount"}
                                        onBlur={onBlur}
                                        loadOptions={searchCurrency}
                                        onChange={(val) => onChange(val?.value)}
                                    />
                                )}
                            />
                            : <AsyncSelect isDisabled />
                    }
                    <SubmitWithState className="bg-secondary text-white active:bg-primary"
                        state={formSubmitState}
                        value={"Create new Account"}
                    />
                </div>
            </form>
        </section>
    )
}

export { CreateBankAccountForm };