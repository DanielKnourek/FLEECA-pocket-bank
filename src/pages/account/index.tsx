import Layout from "@/components/Layout";
import { useUser } from "@/components/useUser";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import {CreateBankAccountForm} from '@/components/CreateBankAccountForm'
import { BankAccountList } from "@/components/BankAccountList";
import { MakeTransactionForm } from "@/components/MakeTransactionForm";

const UserAccount: NextPage = () => {
    const user = useUser();


    return (
        <Layout requireSession={true}>
            private User Account
            <BankAccountList />
            <MakeTransactionForm />
            <CreateBankAccountForm />
        </Layout>
    )
}
export default UserAccount;