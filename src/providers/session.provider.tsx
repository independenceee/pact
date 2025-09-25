import { PropsWithChildren } from "react";
import { SessionProvider as SessionInstance } from "next-auth/react";
import { auth } from "~/lib/auth";

export default async function SessionProvider({ children }: PropsWithChildren) {
    const session = await auth();
    return <SessionInstance session={session}>{children}</SessionInstance>;
}
