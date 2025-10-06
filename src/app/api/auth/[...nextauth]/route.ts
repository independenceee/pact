import NextAuth from "next-auth/next";
import type { NextAuthOptions, Account, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "~/libs/prisma";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
    providers: [
        CredentialsProvider({
            id: "cardano-wallet",
            name: "Cardano Wallet",
            credentials: {
                address: { label: "Wallet Address", type: "text" },
                signature: { label: "Signature", type: "text" },
                message: { label: "Message", type: "text" },
                wallet: { label: "Wallet Name", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials?.address || !credentials?.signature || !credentials?.message) {
                    return null;
                }
                const address = String(credentials.address);
                const walletName = String(credentials.wallet ?? "");
                type WalletUser = User & { address?: string; wallet?: string };

                const user = await prisma.user.upsert({
                    where: {
                        address,
                    },
                    create: {
                        address,
                    },
                    update: {},
                });

                console.log(user);

                return {
                    id: user.id,
                    name: "User",
                    image: null,
                    address,
                    wallet: walletName,
                };
            },
        }),
    ],
    pages: { signIn: "/", signOut: "/" },
    callbacks: {
        async redirect({ baseUrl }: { baseUrl: string }) {
            return baseUrl;
        },
        async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
            type WalletToken = JWT & { address?: string; wallet?: string | undefined };
            type WalletUser = User & { address?: string; wallet?: string };
            if (user && account?.provider === "cardano-wallet") {
                (token as WalletToken).address = (user as WalletUser).address;
                (token as WalletToken).wallet = (user as WalletUser).wallet;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            type WalletToken = JWT & { address?: string; wallet?: string | undefined };
            const addr = (token as WalletToken).address;
            if (session.user && addr) {
                (session.user as typeof session.user & { address?: string; wallet?: string }).address = addr;
                (session.user as typeof session.user & { address?: string; wallet?: string }).wallet =
                    (token as WalletToken).wallet ?? "";
            }
            if (!session.expires) {
                session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
            }
            return session;
        },
        async signIn(_: { user: User; account: Account | null }) {
            return true;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
