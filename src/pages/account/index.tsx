import Layout from "@/components/Layout";
import { useUser } from "@/components/useUser";
import { NextPage } from "next";
import { signIn } from "next-auth/react";

const UserAccount: NextPage = () => {
    const user = useUser();


    return (
        <Layout requireSession={true}>
            private User Account
        </Layout>
    )
}
export default UserAccount;