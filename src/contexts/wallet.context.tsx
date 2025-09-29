"use client";

import { BrowserWallet, Wallet, UTxO } from "@meshsdk/core";
import { Session } from "next-auth";
import { createContext } from "react";

export type WalletContextType = {
    wallet: Wallet | null;
    address: string | null;
    stakeAddress: string | null;
    browserWallet: BrowserWallet | null;
    getBalance: () => Promise<number>;
    getUtxos: () => Promise<Array<UTxO>>;
    signTx: (unsignedTx: string) => Promise<string>;
    submitTx: (signedTx: string) => Promise<string>;
    disconnect: () => Promise<void>;
    connect: (session: Session | null, wallet: Wallet) => Promise<void>;
    syncWithSession: (session: Session | null) => Promise<void>;
};

export const WalletContext = createContext<WalletContextType>(null!);
