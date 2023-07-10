import Layout from "@/components/Layout";
import { useUser } from "@/components/useUser";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { CreateBankAccountForm } from '@/components/CreateBankAccountForm'
import { BankAccountList } from "@/components/BankAccountList";
import { MakeTransactionForm } from "@/components/MakeTransactionForm";
import { newATMTransactionClientSchema, newATMTransactionClientType, newTransactionClientType } from "@/types/transaction";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { useSubmitWithState } from "@/components/SubmitWithState";
import { useEffect } from "react";


const UserAccount: NextPage = () => {
    const resolverSchema = newATMTransactionClientSchema;

    const { handleSubmit, formState: { errors }, control, register, watch } = useForm<newATMTransactionClientType>({
        resolver: zodResolver(resolverSchema, { async: true }),
        defaultValues: {
            type: 'deposit',
        }
    });
    const SubmitButton = useSubmitWithState();

    const processATMTransaction = api.transaction.processATMTransaction.useMutation();
    const bankAccounts = api.bankAccount.listOwnerBankAccounts.useQuery();


    const processTransactionSubmit = async (data: newATMTransactionClientType) => {
        SubmitButton.set('loading');
        // TODO better transform method
        const transformedData: newATMTransactionClientType = (data.type == 'deposit') ? {
            type: 'deposit',
            receiver_account_id: data.receiver_account_id,
            receiver_payment_ammount: data.receiver_payment_ammount
        } : {
            type: 'withdraw',
            receiver_account_id: data.receiver_account_id,
            receiver_payment_ammount: -data.receiver_payment_ammount,
        }
        await processATMTransaction.mutateAsync(transformedData)
            .then(data => {
                SubmitButton.set('success');
            })
            .catch(error => {
                SubmitButton.set('error');
            })

    }

    type selectBankAccountList = { value: string, label: string }[];

    const listBankAccounts = (inputValue: string) => {
        return new Promise<selectBankAccountList>((resolve) => {
            if (!bankAccounts.data) {
                resolve([]);
                return;
            }
            const filteredlist = bankAccounts.data
                .reduce((filtered, bankAccount) => {
                    //TODO fix update label on data invalidation
                    const label = `${bankAccount.currency_name}: ${Number(bankAccount.balance).toFixed(2)} ${bankAccount.currency_code} (${bankAccount.id})`;
                    if (label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())) {
                        filtered.push({
                            value: bankAccount.id,
                            label,
                        })
                    }
                    return filtered;
                }, [] as selectBankAccountList)
            resolve(filteredlist)
        });
    }

    console.log(errors); //TODO remove

    return (
        <Layout requireSession={true}><section className=""
        >
            <form className="flex flex-col bg-primary rounded-t-xl rounded-b-xl m-2 p-2"
                onSubmit={handleSubmit(processTransactionSubmit)}
            >
                <div className="my-2 w-full flex flex-col">
                    <div>
                        <label className="m-2 font-bold">
                            Select account for payment.
                        </label>
                        {errors.receiver_account_id && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.receiver_account_id.message}</span>}
                    </div>
                    {
                        !!bankAccounts?.data ?
                            <Controller
                                name="receiver_account_id"
                                control={control}
                                rules={{ required: true }}
                                render={({ field: { onChange, onBlur, value, name, ref } }) => (
                                    <AsyncSelect cacheOptions
                                        defaultOptions
                                        instanceId={"Account you want to send money form"}
                                        onBlur={onBlur}
                                        loadOptions={listBankAccounts}
                                        onChange={(val) => onChange(val?.value)}
                                    />
                                )}
                            />
                            : <AsyncSelect isDisabled />
                    }
                </div>

                <div className="bg-secondary h-1 w-full"></div>

                <div className="my-2 w-full flex flex-col">
                    <div>
                        <label className="m-2 font-bold">
                            Ammount to be transfered.
                        </label>
                    </div>
                    <input className="appearance-none p-2"
                        type="number"
                        step={"0.01"}
                        {...register('receiver_payment_ammount', { valueAsNumber: true })}
                    />
                </div>

                <div className="bg-secondary h-1 w-full"></div>
                <div className="my-2 w-full flex flex-col">
                    <div>
                        <label className="m-2 font-bold">
                            Type of transaction
                        </label>
                        {errors.type && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.type.message}</span>}
                    </div>
                    <div className="w-full flex flex-row justify-items-center">
                        <label className={`p-2 text-white font-bold grow rounded-l-lg ${watch('type') == 'deposit' ? 'bg-secondary' : 'bg-primary'} border-secondary border-4 justify-center flex shadow-xl`}>
                            Deposit
                            <input className="appearance-none"
                                type="radio"
                                value='deposit'
                                {...register('type')}
                            />
                        </label>
                        <div className="w-2 bg-primary"></div>
                        <label className={`p-2 text-white font-bold grow rounded-r-lg ${watch('type') == 'withdraw' ? 'bg-secondary' : 'bg-primary'} border-secondary border-4 justify-center flex shadow-xl`}>
                            Withdraw
                            <input className="appearance-none"
                                type="radio"
                                value='withdraw'
                                {...register('type')}
                            />
                        </label>
                    </div>
                </div>

                <div className="bg-secondary h-1 w-full"></div>
                <SubmitButton.button className="bg-secondary text-white active:bg-primary"
                    state={SubmitButton.get}
                    value={"Send to process"}
                />
            </form>
        </section>
        </Layout>
    )
}
export default UserAccount;