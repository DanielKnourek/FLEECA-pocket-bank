import { OwnerBankAccountListType } from "@/types/bankAccount";
import { api } from "@/utils/api";

const BankAccountList = () => {
    const Accounts = api.bankAccount.listOwnerBankAccounts.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
    return (
        <section className="p-1"
        >
            List of your accounts
            {Accounts.data && Accounts.data.map(account => <BankAccount account={account} />)}
        </section>
    )
}
interface BankAccountParams {
    account: OwnerBankAccountListType[number]
}

const BankAccount = ({ account }: BankAccountParams) => {
    const deleteBankAccount = api.bankAccount.deleteEmptyAccount.useMutation();

    const onDelete = async () => {
        const res = await deleteBankAccount.mutateAsync({ id: account.bank_account_id });
    }

    return (
        <section className="flex flex-row bg-primary rounded-t-xl rounded-b-xl m-2 p-2"
            title="Bank Account"
            id={`${account.bank_account_id}`}
        >
            <div className="flex flex-col">
                <div>
                <span className="text-xl">
                {account.currency_code}
                </span>
                <span className="px-2 text-gray-600">
                {account.currency_name}
                </span>
                </div>
                <span className="">
                    #{account.bank_account_id}
                </span>

            </div>

            <div className="grow" />

            <div className="flex flex-col self-center bg-secondary text-white p-2 h-full mr-2 rounded-xl">
                <span className="text-2xl font-bold">
                    {`${parseFloat(account.balance + '').toFixed(2)}`}
                </span>

            </div>
            <div className="self-center">
                <button className=""
                title="Delete account"
                    onClick={onDelete}
                >
                    ✖️
                </button>
            </div>


        </section>
    )
}
export { BankAccountList };