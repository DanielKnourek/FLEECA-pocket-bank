import { ReactNode, useContext } from "react";
import { UserSession } from "./UserSession";
import { useUser } from "@/components/useUser";
import { Navbar } from "@/components/Navbar";

type LayoutParams = {
  children: ReactNode,
  requireSession?: boolean
}
const Layout = ({ children, ...params }: LayoutParams) => {
  if (!!params.requireSession) {
    return (
      <UserSession>
        <ProtectedAppLayout>
          {children}
        </ProtectedAppLayout>
      </UserSession>
    )
  }
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
}

type AppLayoutParams = {
  children: ReactNode,
}
const AppLayout = ({ children }: AppLayoutParams) => {

  return (<>
    <Navbar />
    <main className="p-4">
      {children}
    </main>
  </>)
}

const ProtectedAppLayout = ({ children }: AppLayoutParams) => {
  const user = useUser();
  const usercontext = useContext(user.context);

  return (<>
    <AppLayout>
      {usercontext?.errorMessage ?? children}
    </AppLayout>
  </>)
}
export default Layout;