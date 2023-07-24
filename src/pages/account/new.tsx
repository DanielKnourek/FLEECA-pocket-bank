import type { NextPage } from "next";
import type { newUserType } from "@/types/userAccount";

import Layout from "@/components/Layout";
import { useUser } from "@/components/useUser";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'
// import { newUserSchema } from "@/server/api/routers/user";
import { api } from "@/utils/api";
import { newUserSchema } from "@/types/userAccount";
import { useEffect } from "react";

const UserAccount: NextPage = () => {
    const user = useUser();

    const registerUser = api.user.registerUser.useMutation();

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<newUserType>({ resolver: zodResolver(newUserSchema) });

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        setValue('email', `${user.session.data?.tokenData.email}`);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        setValue('login_platform_uid', `${user.session.data?.tokenData.provider}`);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        setValue('first_name', `${user.session.data?.tokenData.name}`);
    }, [user.session])


    const createUserSubmit = async (data: newUserType) => {
        await registerUser.mutateAsync(data);
        // TODO redirect on success
    }

    return (
        <Layout>
            Welcome, please fill these so we can get to know you.
            <div className="w-full p-2 flex place-content-center">

                <form className="flex flex-col bg-primary w-full sm:w-1/2 rounded-t-xl rounded-b-xl m-2"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onSubmit={handleSubmit(createUserSubmit)}
                >
                    <div className="p-2 w-full flex flex-col">
                        <div>
                            <label className="m-2 font-bold">
                                Email
                            </label>
                            {errors.email && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">Could not obtain email, plese signIn agin.</span>}
                        </div>
                        <input className="p-1"
                            type="text"
                            disabled
                            {...register('email')} />
                    </div>
                    <div className="bg-secondary h-1 w-full"></div>
                    <div className="p-2 w-full flex flex-col">
                        <div>
                            <label className="m-2 font-bold">
                                @Provider
                            </label>
                            {errors.login_platform_uid && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">Could not obtain your login source, plese signIn agin.</span>}
                        </div>
                        <input className="p-1"
                            type="text"
                            disabled
                            {...register('login_platform_uid')} />
                    </div>
                    <div className="bg-secondary h-1 w-full"></div>
                    <div className="p-2 w-full  flex flex-col">
                        <div>
                            <label className="m-2 font-bold">
                                First name
                            </label>
                            {errors.first_name && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.first_name.message}</span>}
                        </div>
                        <input className="p-1"
                            type="text"
                            {...register('first_name')} />
                    </div>
                    <div className="bg-secondary h-1 w-full"></div>
                    <div className="p-2 w-full flex flex-col">
                        <div>
                            <label className="m-2 font-bold">
                                Last name
                            </label>
                            {errors.last_name && <span className="bg-red-500 text-white px-2 rounded-xl text-sm">{errors.last_name.message}</span>}
                        </div>
                        {/* TODO implement SubmitWithState */}
                        <input className="p-1"
                            type="text"
                            {...register('last_name')} />
                    </div >
                    <input className="bg-secondary pb-2 pt-2 font-bold text-white rounded-b-xl cursor-pointer active:bg-primary"
                        type="submit" />
                </form >

            </div>
        </Layout >
    )
}
export default UserAccount;