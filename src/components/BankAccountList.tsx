import type { OwnerBankAccountListType } from "@/types/bankAccount";

import { api } from "@/utils/api";
import { TransactionLogList } from "./TransactionLog";
import { MdOutlineDelete } from "react-icons/md";

const BankAccountList = () => {
    const Accounts = api.bankAccount.listOwnerBankAccounts.useQuery(undefined, { staleTime: 5 * 60 * 1000 });
    return (
        <section className="p-1 flex flex-wrap place-content-evenly border-secondary border-4 rounded-xl"
        >
            <h3 className="flex place-items-center place-content-center w-[calc(100%+1rem)] md:max-w-[56rem] md:flex-1 md:min-w-[28rem] bg-secondary md:m-2 -ml-2 -mt-2 -mr-2 rounded-xl p-2 text-white font-bold">
                List of your accounts
            </h3>
            {Accounts.data && Accounts.data.map(account => <BankAccount account={account} key={account.id} />)}
            <div className="flex-grow md:p-2 md:m-2"></div>
        </section>
    )
}
interface BankAccountParams {
    account: OwnerBankAccountListType[number]
}

const BankAccount = ({ account }: BankAccountParams) => {
    const deleteBankAccount = api.bankAccount.deleteEmptyAccount.useMutation();

    const onDelete = async () => {
        await deleteBankAccount.mutateAsync({ id: account.bank_account_id });
    }

    return (
        // <section className="w-fullbg-primary rounded-t-xl rounded-b-xl m-2 p-2 md:grid-cols-2 max-w-lg"
        <section className="w-full md:max-w-[56rem] md:flex-1 md:min-w-[28rem] bg-primary rounded-t-xl rounded-b-xl m-2 p-2"
            title={`Bank Account ${account.currency_code}`}
        >
            <div className="flex flex-row grow">
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
                        {account.bank_account_id}
                    </span>

                </div>

                <div className="grow" />

                <div className="flex flex-col self-center bg-secondary text-white p-2 h-full mr-2 rounded-xl">
                    <span className="text-2xl font-bold">
                        {`${Number(account.balance).toFixed(2)}`}
                    </span>

                </div>
                <div className="self-center">
                    <button className="bg-secondary rounded-lg"
                        title="Delete account"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={onDelete}
                    >
                        <MdOutlineDelete size={25} color="white" />
                    </button>
                </div>
            </div>
            <div className="bg-secondary h-1 w-full mt-1"></div>
            <TransactionLogList account={account} />
        </section>
    )
}
export { BankAccountList };