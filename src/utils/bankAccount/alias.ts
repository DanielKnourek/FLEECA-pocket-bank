import { env } from "@/env.mjs"

interface alias {
    id: string | null,
    alias: string,
};

const aliasList: alias[] = [
    {
        alias: 'ATM',
        id: env.NEXT_PUBLIC_SYSTEM_ATM_BANKACCOUNT_ID
    },
    {
        alias: 'ATM_SYSTEM',
        id: env.NEXT_PUBLIC_SYSTEM_ATM_USERACCOUNT_ID
    },
    {
        alias: 'Deleted Account',
        id: null
    },
];

const checkForAlias = (bankAccountID : string) => {
    const alias = aliasList.find(alias => alias.id == bankAccountID);    
    return alias?.alias;
}

export { checkForAlias }