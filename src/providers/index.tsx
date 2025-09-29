"use client";

import React from "react";
import { SessionProvider, SessionProviderProps } from "next-auth/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "~/components/ui/sonner";
import { WalletProvider } from "./wallet.provider";

export default function Provider({
    children,
    session,
}: {
    children: React.ReactNode;
    session: SessionProviderProps["session"];
}) {
    const queryClient = new QueryClient();
    return (
        <SessionProvider session={session}>
            <QueryClientProvider client={queryClient}>
                <WalletProvider>{children}</WalletProvider>
                <Toaster />
            </QueryClientProvider>
        </SessionProvider>
    );
}
