import type { OwnerBankAccountListType } from "@/types/bankAccount";

import { type RouterOutputs, api } from "@/utils/api";
import { checkForAlias } from "@/utils/bankAccount/alias";
import { useState } from "react";
import { MdAddCircleOutline, MdExpandMore, MdOutlineArrowBack, MdOutlineArrowForward, MdOutlineIndeterminateCheckBox } from "react-icons/md";

interface TransactionLogListParams {
    account: OwnerBankAccountListType[number]
}

const TransactionLogList = ({ account }: TransactionLogListParams) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const accountTransactions = api.transaction.listBankAccountTransactions.useQuery({
        id: account.id,
    })

    return (
        <div className="min-h-10">
            <div className="relative w-full ">
                <button className={`absolute top-1 right-4 ${isOpen ? 'rotate-180' : 'rotate-0'} bg-secondary rounded-lg hover:rounded-full transition-all duration-300`}
                    title="Show Log"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <MdExpandMore size={35} color="white" />
                </button>
            </div>
            <section className={`flex flex-col ${isOpen ? 'max-h-32' : 'max-h-0'} transition-all duration-300 overflow-auto`}
                title={`Transaction log ${account.id}`}
            >
                {
                    accountTransactions.data ? accountTransactions.data.map(transaction => {
                        const TransactionDirection: TransactionLogParams['direction'] = transaction.sender_account_id == account.id ? 'outgoing' : 'incoming';
                        return (
                            <TransactionLog data={transaction} direction={TransactionDirection} key={transaction.id} />
                        )
                    }) : "No records."
                }
            </section>
        </div>
    )
}

interface TransactionLogParams {
    data: RouterOutputs['transaction']['listBankAccountTransactions'][number],
    direction: 'incoming' | 'outgoing',
}


const TransactionLog = ({ data, direction }: TransactionLogParams) => {

    if (direction == 'incoming') {
        return (
            <span className="grid grid-cols-11 border-b-secondary border-b-4 items-center">
                <MdAddCircleOutline color="green" />
                <div className="w-16 col-span-2">
                    {Number(data.receiver_payment_ammount).toFixed(2)}
                </div>
                <div className="w-1 bg-secondary h-full"></div>
                <div className="col-span-4 flex flex-row ">
                    <MdOutlineArrowBack />
                {checkForAlias(data.sender_account_id) ?? data.sender_account_id} 
                </div>
                <div className="w-1 bg-secondary h-full"></div>
                {new Intl.DateTimeFormat('cs-CZ', { timeStyle: 'medium', dateStyle: "medium" }).format(data.created_at)}
            </span>
        )
    }
    return (
        <span className="grid grid-cols-11 border-b-secondary border-b-4 items-center">
            <MdOutlineIndeterminateCheckBox color="red" />
                <div className="w-16 col-span-2">
                {Number(data.sender_payment_ammount).toFixed(2)}
            </div>
            <div className="w-1 bg-secondary h-full"></div>
            <div className="col-span-4 flex flex-row ">
                <MdOutlineArrowForward />
                {checkForAlias(data.receiver_account_id) ?? data.receiver_account_id} 
            </div>
            <div className="w-1 bg-secondary h-full"></div>
            {new Intl.DateTimeFormat('cs-CZ', { timeStyle: 'medium', dateStyle: "medium" }).format(data.created_at)}
        </span>
    )
}

export { TransactionLogList }