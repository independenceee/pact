import NextAuth from "next-auth/next";
import type { NextAuthOptions, Account, User, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";

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
            },
            async authorize(credentials) {
                if (!credentials?.address || !credentials?.signature || !credentials?.message) {
                    return null;
                }
                const address = String(credentials.address);
                type WalletUser = User & { address?: string; wallet?: string };
                const user: WalletUser = {
                    id: address,
                    name: "User",
                    image: null,
                    address,
                    wallet: address,
                };
                return user;
            },
        }),
    ],
    pages: { signIn: "/", signOut: "/" },
    callbacks: {
        async redirect({ baseUrl }: { baseUrl: string }) {
            return baseUrl;
        },
        async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
            type WalletToken = JWT & { address?: string };
            type WalletUser = User & { address?: string };
            if (user && account?.provider === "cardano-wallet") {
                (token as WalletToken).address = (user as WalletUser).address;
            }
            return token;
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            type WalletToken = JWT & { address?: string };
            const addr = (token as WalletToken).address;
            if (session.user && addr) {
                (session.user as typeof session.user & { address?: string; wallet?: string }).address = addr;
                (session.user as typeof session.user & { address?: string; wallet?: string }).wallet = (session.user as any).wallet ?? addr;
            }
            if (!session.expires) {
                session.expires = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
            }
            return session;
        },
        async signIn(_: { user: User; account: Account | null }) { return true; },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

