import { signIn } from "next-auth/react"

interface ErrorDisplayParams {
    message: React.ReactNode
}

const ErrorDisplay: React.FC<ErrorDisplayParams> = ({ ...params }) => {
    return (<>
        {params.message}
    </>)
}

const AccessDenied = () => {
    return (<>
    To view this page you need to signIn.
        <button onClick={() => signIn()}>SignIn</button>
        {/* <button onClick={() => signIn('discord', {redirect: false})}>SignIn</button> */}
    </>)
}

const getLoading = () => {
    return <Loading />;
}
const Loading = () => {
    return (<>
        Loading please wait...
    </>)
}
export { ErrorDisplay, AccessDenied, Loading, getLoading };