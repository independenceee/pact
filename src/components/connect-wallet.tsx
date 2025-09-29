"use client";

import dynamic from "next/dynamic";
// import { isNil } from "lodash";
import { ClipLoader } from "react-spinners";
import {
    Dialog,
    DialogClose,
    DialogContent,
    // DialogDescription,
    // DialogFooter,
    // DialogHeader,
    // DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog";
// import { router } from "~/constants/router.constant";
// import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "~/libs/utils";
import wallets from "~/constants/wallets.constant";
import { networks } from "~/constants/networks.constant";
import Network from "./network";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { WalletType } from "~/types";
import Wallet from "./wallet";
import Account from "./account";
import { useWallet } from "~/hooks/use-wallet";

const WalletDynamic = () => {
    const [network, setNetwork] = useState<string>("preview");
    const { wallet, connect, address } = useWallet();
    useEffect(() => {
        const networkConnection = localStorage.getItem("network");
        if (networkConnection) {
            setNetwork(JSON.parse(networkConnection));
        }
    }, []);

    useEffect(() => {
        if (network) {
            localStorage.setItem("network", JSON.stringify(network));
        }
    }, [network]);

    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "authenticated") {
            // router.push("/dashboard");
            return;
        }
    }, [status, router]);

    const triedAuto = useRef(false);
    useEffect(() => {
        if (status !== "authenticated") return;
        if (wallet && address) return;
        if (triedAuto.current) return;
        triedAuto.current = true;
        try {
            let last = "";
            try { last = localStorage.getItem("lastWallet") || ""; } catch {}
            const selected = wallets.find((w) => w.name.toLowerCase() === last.toLowerCase()) || wallets[0];
            if (selected) {
                void connect(session ?? null, {
                    id: selected.id || selected.name,
                    name: selected.name,
                    icon: selected.image || "",
                    version: selected.version || "",
                } as any);
            }
        } catch {}
    }, [status, wallet, address, session, connect]);
    return (
        <div>
           {status === "authenticated" && wallet && address ? (
            <Account />
            ) : (
                <div className="hidden lg:flex items-center space-x-4">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                className={cn(
                                    "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 text-shadow-lg ring-purple-400/30 hover:ring-purple-400/40 transition-all cursor-pointer shadow-md rounded-lg",
                                )}
                            >
                                Connect Wallet
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[540px] box-border py-[35px] px-[45px] bg-gray-900 border-purple-300/20 dark:bg-gray-800 dark:border-purple-400/40 shadow-lg rounded-md">
                            <div className="flex items-center justify-between">
                                <div className="text-[20px] text-white dark:text-white">
                                    <strong>Connect Wallet</strong>
                                </div>
                                <DialogClose className=" w-8 h-8 flex items-center justify-center text-gray-300 dark:text-gray-300 bg-purple-500/20 rounded-lg transition-colors">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </DialogClose>
                            </div>

                            <div className="flex mt-5">
                                <section className="pr-[30px] border-r flex flex-col gap-5 border-solid border-purple-300/20 dark:border-purple-400/40 mr-[30px] h-[230px] overflow-y-auto overflow-x-hidden ">
                                    {networks.map(({ image, name }, index: number) => (
                                        <Network
                                            image={image}
                                            name={name}
                                            key={index}
                                            isActive={name.toLowerCase() === network.toLowerCase()}
                                            setNetwork={setNetwork}
                                        />
                                    ))}
                                </section>
                                <section className="overflow-x-hidden overflow-y-auto pr-[20px] mr-[-20px] h-[230px] flex flex-col gap-2">
                                    {wallets.map((wallet: WalletType, index: number) => (
                                        <Wallet key={index} wallet={wallet} session={session} />
                                    ))}
                                </section>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )}
        </div>
    );
};

export const ConnectWallet = dynamic(() => Promise.resolve(WalletDynamic), {
    loading: () => <ClipLoader size={25} />,
    ssr: false,
});
