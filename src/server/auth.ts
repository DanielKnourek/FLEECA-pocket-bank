import type { GetServerSidePropsContext } from "next";
import type { DefaultJWT, JWT, UserAccountJWT } from "next-auth/jwt";
import type { Database } from "./db/db-schema";
import type { Selectable } from "kysely";

import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import { env } from "@/env.mjs";
import { isRegistered, isRegisteredParams } from "@/utils/userAccount/user";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    tokenData: JWT;
    userAccount?: Extract<UserAccountJWT, { exists: true }>['data'];
  }
}
declare module "next-auth/jwt" {
  type UserAccountJWT = {
    exists: false,
    data?: Selectable<Database['UserAccount']>
  } | {
    exists: true,
    data: Selectable<Database['UserAccount']>
  }
  interface JWT extends DefaultJWT {
    provider?: string,
    userAccount?: UserAccountJWT
  }
}
// const foo: JWT = {
//   userAccountExists: false,
//   user: "foo"
// }

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    newUser: "/account/new",
  },
  callbacks: {
    signIn() {

      return true;
    },
    redirect({ url, baseUrl }) {

      const getCallbackUri = (params: { url: string, baseUrl: string }) => {
        // Allows relative callback URLs

        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      }

      return getCallbackUri({ baseUrl, url });
    },

    session({ session, token }) {

      if (token.userAccount) {
        session.tokenData = {
          email: token.email,
          name: token.email,
          picture: token.picture,
          provider: token.provider,
          userAccount: token.userAccount,
        };
        session.userAccount = token.userAccount.data;
      }
      return session
    },
    async jwt({ token, account }) {
      if (!!account?.provider) {
        token.provider = account?.provider;
      }

      let isUser: Selectable<Database['UserAccount']> | undefined;
      if (!token.userAccount || !token.userAccount.exists) {
        const targetUserAccount: isRegisteredParams = {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          email: `${token.email}`,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          login_platform_uid: `${token?.provider}`,
        };

        isUser = await isRegistered(targetUserAccount);
        if (isUser == undefined) {
          token = {
            ...token,
            userAccount: {
              exists: false,
            }
          };
        }
        else {
          token = {
            ...token,
            userAccount: {
              exists: true,
              data: isUser,
            }
          };
        }
      }

      return token;
    },
  },
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),

    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Demo login",
      credentials: {

      },
      authorize(credentials, req) {
        // const demoUserData: Extract<UserAccountJWT, { exists: true }>['data'] = {
        //   email: 'demo@test.it',
        //   first_name: 'Demo User',
        //   last_name: null,
        //   enabled: true,


        // }
        return {
          id: '007',
          email: 'demo@test.it',
          name: 'Demo User',
        }
      },

    })
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
