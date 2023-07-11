import { useDB } from "@/server/db"
import { Database } from "@/server/db/db-schema"
import { newUserType } from "@/types/userAccount"
import { InsertResult, Insertable, Selectable } from "kysely"

interface createUserResponseSuccess {
    success: true,
    userData: InsertResult[],
} 
interface createUserResponseError {
    success: false,
    error: any,
}
type createUserResponse = createUserResponseSuccess | createUserResponseError;

const createUser = async (newUser: newUserType): Promise<createUserResponse> => {
    return await useDB.insertInto('UserAccount')
        .values(newUser)
        .execute()
        .then(res => {
            return {
                success: true,
                userData: res,
            } as createUserResponseSuccess
        })
        .catch(err => {
            return {
                success: false,
                error: "err",
            } as createUserResponseError;
        });
}

type isRegisteredParams = Pick<Insertable<Database['UserAccount']>, 'email' | 'login_platform_uid'>
const isRegistered = async (user: isRegisteredParams): Promise<Selectable<Database['UserAccount']> | undefined> => {
    return await useDB.selectFrom('UserAccount')
        .selectAll()
        .where('UserAccount.email', '=', user.email)
        .where('UserAccount.login_platform_uid', '=', user.login_platform_uid)
        .executeTakeFirst();
}

export type { isRegisteredParams };
export { createUser, isRegistered };