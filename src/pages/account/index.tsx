import type { NextPage } from "next";

import Layout from "@/components/Layout";
import { useUser } from "@/components/useUser";
import { CreateBankAccountForm } from '@/components/CreateBankAccountForm'
import { BankAccountList } from "@/components/BankAccountList";
import { MakeTransactionForm } from "@/components/MakeTransactionForm";

const UserAccount: NextPage = () => {
    const user = useUser();


    return (
        <Layout requireSession={true}>
            <BankAccountList />
            <MakeTransactionForm />
            <CreateBankAccountForm />
        </Layout>
    )
}
export default UserAccount;