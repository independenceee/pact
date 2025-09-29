import { PropsWithChildren } from "react";
import { SessionProvider as SessionInstance } from "next-auth/react";
// import { auth } from "~/libs/auth";
// export default async function SessionProvider({ children }: PropsWithChildren) {
//     const session = await auth();
//     return <SessionInstance session={session}>{children}</SessionInstance>;
export default function SessionProvider({ children }: PropsWithChildren) {
    return <SessionInstance>{children}</SessionInstance>;
}
