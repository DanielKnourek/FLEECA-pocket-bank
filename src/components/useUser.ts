import { useSession } from "next-auth/react"
import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";

const userContext = createContext<userContextType | undefined>(undefined);

const useUser = () => {
    const session = useSession();

    return {
        session,
        context: userContext
    }
}

interface userContextType {
    errorMessage?: ReactNode,
    setErrorMessage: Dispatch<SetStateAction<userContextType['errorMessage']>>
}
const getContextDefaults = (): userContextType => {
    const [errorMessage, setErrorMessage] = useState<userContextType['errorMessage']>(undefined);
    return {
        setErrorMessage,
        errorMessage
    }
}

export type { userContextType }
export { useUser, getContextDefaults }