import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "@/utils/api";

const DevPlace: NextPage = () => {

    // const hello = api.example.hello.useQuery({ text: "from tRPC" });
    const message = api.example.getExchangeRate.useQuery();
    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="My testing place" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
                <div className="text-white text-lg">
                    {JSON.stringify(message.data, null, ' ')}
                </div>
            </main>
        </>
    );
};

export default DevPlace;
