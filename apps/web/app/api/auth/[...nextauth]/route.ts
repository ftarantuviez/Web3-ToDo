import "server-only";
import NextAuth, { Account, getServerSession, Profile, User } from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider, {
  CredentialInput,
} from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";
import { SiweMessage } from "siwe";
import { AdapterUser } from "next-auth/adapters";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
        csrfToken: {
          label: "CSRF Token",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials) throw new Error("No credentials");
          if (!req.headers) throw new Error("No headers");

          // Parse the siwe message
          const nextAuthUrl = new URL(req.headers?.origin || "");
          const siwe = new SiweMessage(JSON.parse(credentials.message || "{}"));

          // Verify the signature. The nonce is the CSRF token and will ensure
          // the signature is fresh and not replayed from old another session
          const result = await siwe.verify({
            signature: credentials.signature,
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          });

          // We upsert the user in the database to keep track the last login
          // but also the last chainId used
          if (result.success) {
            return {
              id: siwe.address,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    signIn: async (
      params: Readonly<{
        user: User | AdapterUser;
        account: Account | null;
        profile?: Profile;
        email?: { verificationRequest?: boolean };
        credentials?: Record<string, CredentialInput>;
      }>
    ) => {
      const currentSession = await getServerSession(authOptions);
      return !currentSession && params.account?.provider === "credentials";
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.account = token.id as string;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
