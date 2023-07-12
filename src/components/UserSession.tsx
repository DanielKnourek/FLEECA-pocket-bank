import { type userContextType, useUser } from "@/components/useUser"
import { type ReactNode, useEffect, useState } from "react"
import { AccessDenied, Loading } from "@/components/ErrorDisplay";
import { useRouter } from "next/router";

type UserSessionParams = {
    children: ReactNode,
}
const UserSession: React.FC<UserSessionParams> = ({ children }) => {
    const user = useUser();

    const [errorMessage, setErrorMessage] = useState<userContextType['errorMessage']>();
    const userContext = {
        setErrorMessage,
        errorMessage
    };
    useEffect(() => {
        userContext.setErrorMessage(<Loading />);
    }, [])
 
    const { push } = useRouter();

    useEffect(() => {
        let isError = false;
        if (!user?.session || user?.session?.status == 'loading') {
            userContext.setErrorMessage(<Loading />);
            isError = true;
        }
        if (!isError && (!user.session || user.session.status != 'authenticated')) {
            userContext.setErrorMessage(<AccessDenied />);
            isError = true;
        }
        if (!isError && (user.session.data?.tokenData?.userAccount?.exists == false)) {
            push("/account/new")
            .catch(err => console.log('Cannot redirect. ', err))
            return;
        }

        if (!isError) {
            userContext.setErrorMessage(undefined);
        }
    }, [user.session, user.session.status]);

    return (
        <>
            <user.context.Provider value={userContext}>
                {children}
            </user.context.Provider>
        </>
    )
}

export { UserSession };