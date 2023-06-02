import Layout from "@/components/Layout";
import { useUser } from "@/components/useUser";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import {CreateBankAccountForm} from '@/components/CreateBankAccountForm'
import { BankAccountList } from "@/components/BankAccountList";

const UserAccount: NextPage = () => {
    const user = useUser();


    return (
        <Layout requireSession={true}>
            private User Account
            <BankAccountList />
            <CreateBankAccountForm />
        </Layout>
    )
}
export default UserAccount;