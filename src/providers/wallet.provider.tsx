import React, { useEffect, useState } from "react";
import { BrowserWallet, UTxO, Wallet } from "@meshsdk/core";
import { Session } from "next-auth";
import { isNil } from "lodash";
import { getNonceAddress } from "~/utils/auth";
import { signIn, useSession } from "next-auth/react";
import { APP_NETWORK, APP_NETWORK_ID } from "~/constants/enviroments.constant";
import { wallets } from "~/constants/wallets.constant";
import { WalletContext } from "~/contexts/wallet.context";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: session, status } = useSession();
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [browserWallet, setBrowserWallet] = useState<BrowserWallet | null>(null);
    const [address, setAddress] = useState<string | null>(null);
    const [stakeAddress, setStakeAddress] = useState<string | null>(null);

    const getUtxos = async (): Promise<Array<UTxO>> => {
        if (!browserWallet) {
            return [];
        }
        return await browserWallet.getUtxos();
    };

    const getBalance = async (): Promise<number> => {
        if (!browserWallet) {
            return 0;
        }
        const balance = await browserWallet.getLovelace();
        return Number(balance);
    };

    const signTx = async (unsignedTx: string): Promise<string> => {
        if (!browserWallet || !wallet) {
            throw new Error("Wallet not connected");
        }
        const signedTx = await browserWallet.signTx(unsignedTx);
        if (!signedTx) {
            throw new Error("Failed to sign data");
        }
        return signedTx;
    };

    const submitTx = async (signedTx: string): Promise<string> => {
        if (!browserWallet) {
            throw new Error("Wallet not connected");
        }
        const txHash = await browserWallet.submitTx(signedTx);
        if (!txHash) {
            throw new Error("Failed to submit transaction");
        }
        return txHash;
    };

    const connect = async (session: Session | null, wallet: Wallet): Promise<void> => {
        try {
            const { name } = wallet;
            try {
                localStorage.setItem("lastWallet", name);
            } catch (_) {}
            const browserWallet: BrowserWallet = await BrowserWallet.enable(name.toLowerCase());
            if (!browserWallet) {
                throw new Error("Failed to connect wallet");
            }
            const network = await browserWallet.getNetworkId();
            if (network !== APP_NETWORK_ID) {
                throw new Error(`Invalid network, please switch to ${APP_NETWORK}`);
            }
            const address = await browserWallet.getChangeAddress();

            if (address.length === 0) {
                throw new Error("Cant get address");
            }
            const stakeList = await browserWallet.getRewardAddresses();
            if (stakeList.length === 0) {
                throw new Error("Cant get stake address");
            }
            const stakeAddress = stakeList[0];

            if (isNil(session)) {
                const nonceRes = await getNonceAddress(address);
                if (!nonceRes.result || isNil(nonceRes.data)) {
                    throw new Error(nonceRes.message);
                }
                const signature = await browserWallet.signData(nonceRes.data);
                if (isNil(signature)) {
                    throw new Error("Cant get signature");
                }
                await signIn("cardano-wallet", {
                    redirect: false,
                    callbackUrl: "/",
                    address,
                    message: nonceRes.data,
                    signature,
                    wallet: name,
                });
                setBrowserWallet(browserWallet);
                setWallet(wallet);
                setAddress(address);
                setStakeAddress(stakeAddress);
            } else if (session.user?.address !== address) {
                throw new Error("Invalid address");
            } else {
                const address = await browserWallet.getChangeAddress();
                setBrowserWallet(browserWallet);
                setWallet(wallet);
                setAddress(address);
                setStakeAddress(stakeAddress);
            }
        } catch (error) {
            await disconnect();
        }
    };

    const disconnect = async (): Promise<void> => {
        setBrowserWallet(null);
        setWallet(null);
        setAddress(null);
        setStakeAddress(null);
    };

    const syncWithSession = async (session: Session | null): Promise<void> => {
        if (!session?.user?.address) {
            setBrowserWallet(null);
            setWallet(null);
            setAddress(null);
            setStakeAddress(null);
            return;
        }

        if (wallet && address === session.user.address) {
            return;
        }

        try {
            let walletName = (session?.user as { wallet?: string } | undefined)?.wallet;
            if (!walletName) {
                try {
                    walletName = localStorage.getItem("lastWallet") || undefined;
                } catch (_) {}
            }

            if (walletName) {
                let browserWallet: BrowserWallet | null = null;
                let retryCount = 0;
                const maxRetries = 3;

                while (!browserWallet && retryCount < maxRetries) {
                    try {
                        browserWallet = await BrowserWallet.enable(walletName.toLowerCase());
                    } catch (enableError) {
                        retryCount++;
                        if (retryCount < maxRetries) {
                            await new Promise((resolve) => setTimeout(resolve, retryCount * 1000));
                        } else {
                            throw enableError as Error;
                        }
                    }
                }

                if (browserWallet) {
                    const network = await browserWallet.getNetworkId();

                    if (network === APP_NETWORK_ID) {
                        const address = await browserWallet.getChangeAddress();
                        const stakeList = await browserWallet.getRewardAddresses();
                        const stakeAddress = stakeList[0];

                        const walletConfig = wallets.find((w) => w.name.toLowerCase() === walletName!.toLowerCase());

                        setBrowserWallet(browserWallet);
                        setWallet({
                            icon: walletConfig?.image || "",
                            id: walletName!,
                            name: walletName!,
                            version: walletConfig?.version || "",
                        });
                        setAddress(address);
                        setStakeAddress(stakeAddress);
                    }
                }
            }
        } catch {
            // Handle error silently as in the original code
        }
    };

    useEffect(() => {
        syncWithSession(session ?? null);
    }, [session]);

    useEffect(() => {
        if (isNil(session) || status === "unauthenticated") {
            disconnect();
        }
    }, [session, status]);

    return (
        <WalletContext.Provider
            value={{
                wallet,
                browserWallet,
                address,
                stakeAddress,
                getBalance,
                getUtxos,
                signTx,
                submitTx,
                disconnect,
                connect,
                syncWithSession,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};
