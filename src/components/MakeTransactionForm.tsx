import { newTransactionClientSchema, newTransactionClientType } from "@/types/transaction";
import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async";
import { SubmitWithState, useSubmitWithState } from "./SubmitWithState";

interface MakeTransactionFormParams {
}

const MakeTransactionForm = ({ }: MakeTransactionFormParams) => {
    const apiContext = api.useContext();
    const resolverSchema = newTransactionClientSchema.refine(async (data) => {
        return await apiContext.bankAccount.getBankAccountPublicInformation.fetch({ bankAccount_id: data.receiver_account_id })
            .then(data => true)
            .catch(err => false);
    }, {
        message: "This Account doesn't exists!",
        path: ['receiver_account_id'],
    });

    const { handleSubmit, formState: { errors }, control, register, watch } = useForm<newTransactionClientType>({
        resolver: zodResolver(resolverSchema, { async: true }),
        defaultValues: {
            type: 'send',
        }
    });
    const SubmitButton = useSubmitWithState();

    const processTransaction = api.transaction.processTransaction.useMutation();
    const bankAccounts = api.bankAccount.listOwnerBankAccounts.useQuery();


    const processTransactionSubmit = async (data: newTransactionClientType) => {
        SubmitButton.set('loading');
        const result = await processTransaction.mutateAsync(data)
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
                    const label = `${bankAccount.currency_name}: ${bankAccount.balance} ${bankAccount.currency_code} (${bankAccount.id})`;
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
        <section className=""
        >
            <form className="flex flex-col bg-primary rounded-t-xl rounded-b-xl m-2 p-2"
                onSubmit={handleSubmit(processTransactionSubmit)}
            >
                <div className="my-2 w-full flex flex-col">
                    <div>
                        <label className="m-2 font-bold">
                            Select account for payment.
                        </label>
                        {errors.sender_account_id && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.sender_account_id.message}</span>}
                    </div>
                    {
                        !!bankAccounts?.data ?
                            <Controller
                                name="sender_account_id"
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
                            Target account
                        </label>
                        {errors.receiver_account_id && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.receiver_account_id.message}</span>}
                    </div>
                    <input className="appearance-none p-2"
                        type="text"
                        {...register('receiver_account_id')}
                    />
                </div>
                <div className="bg-secondary h-1 w-full"></div>
                {
                    watch('type') == 'send' ?
                        <div className="my-2 w-full flex flex-col">
                            <div>
                                <label className="m-2 font-bold">
                                    Ammount to be transfered.
                                </label>
                            </div>
                            <input className="appearance-none p-2"
                                type="number"
                                {...register('sender_payment_ammount', { valueAsNumber: true })}
                            />
                        </div>
                        :
                        <div className="my-2 w-full flex flex-col">
                            <div>
                                <label className="m-2 font-bold">
                                    Ammount to be transfered.
                                </label>
                            </div>
                            <input className="appearance-none p-2"
                                type="number"
                                {...register('receiver_payment_ammount', { valueAsNumber: true })}
                            />
                        </div>
                }
                <div className="bg-secondary h-1 w-full"></div>
                <div className="my-2 w-full flex flex-col">
                    <div>
                        <label className="m-2 font-bold">
                            Type of transaction
                        </label>
                        {errors.type && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.type.message}</span>}
                    </div>
                    <div className="w-full flex flex-row justify-items-center">
                        <label className={`p-2 text-white font-bold grow rounded-l-lg ${watch('type') == 'send' ? 'bg-secondary' : 'bg-primary'} border-secondary border-4 justify-center flex shadow-xl`}>
                            send
                            <input className="appearance-none"
                                type="radio"
                                value='send'
                                {...register('type')}
                            />
                        </label>
                        <div className="w-2 bg-primary"></div>
                        <label className={`p-2 text-white font-bold grow rounded-r-lg ${watch('type') == 'pay' ? 'bg-secondary' : 'bg-primary'} border-secondary border-4 justify-center flex shadow-xl`}>
                            pay
                            <input className="appearance-none"
                                type="radio"
                                value='pay'
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
    )
}

export { MakeTransactionForm }