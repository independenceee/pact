"use client";
import { useSession } from "next-auth/react";
import { useContext, useEffect } from "react";
import { WalletContext, WalletContextType } from "~/contexts/wallet.context";

export const useWallet = (): WalletContextType => {
    const context = useContext(WalletContext);
    if (context === undefined) {
        throw new Error("useWallet must be used within a WalletProvider");
    }
    return context;
};

export const useWalletSync = () => {
    const { data: session } = useSession();
    const { syncWithSession } = useWallet();

    useEffect(() => {
        if (session) {
            const timeoutId = setTimeout(() => {
                syncWithSession(session);
            }, 1000);
            return () => clearTimeout(timeoutId);
        } else {
            syncWithSession(session);
        }
    }, [session, syncWithSession]);
};
