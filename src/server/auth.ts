import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  Session,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "@/env.mjs";
import { isRegistered, isRegisteredParams } from "@/utils/userAccount/user";
import { DefaultJWT, JWT, UserAccountJWT } from "next-auth/jwt";
import { Database } from "./db/db-schema";
import { Selectable } from "kysely";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    tokenData: JWT;
    userAccount?: UserAccountJWT["data"];
  }
}
declare module "next-auth/jwt" {
  type UserAccountJWT = {
    exists: false,
    data?: any
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
    async signIn({ user, account, profile, email, credentials }) {
      let data = { user, account, profile, email, credentials }

      return true;
      return '/account/new';
    },
    async redirect({ url, baseUrl }) {

      const getCallbackUri = (params: { url: string, baseUrl: string }) => {
        // Allows relative callback URLs

        if (url.startsWith("/")) return `${baseUrl}${url}`
        // Allows callback URLs on the same origin
        else if (new URL(url).origin === baseUrl) return url
        return baseUrl
      }

      return getCallbackUri({ baseUrl, url });
    },

    async session({ session, token, user }) {

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
          email: `${token.email}`,
          login_platform_uid: `${token?.provider}`,
        };

        isUser = await isRegistered(targetUserAccount);
        if (isUser == undefined) {
          token = {
            ...token,
            userAccount: {
              exists: false,
              data: {

              }
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
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
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
