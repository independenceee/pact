"use client";

import { motion } from "framer-motion";
import { useWallet } from "~/hooks/use-wallet";
import { useEffect, useState } from "react";
import { DECIMAL_PLACE } from "~/constants/common.constant";
import { APP_NETWORK } from "~/constants/enviroments.constant";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { shortenString } from "~/libs/utils";
import Copy from "~/components/copy";
import CountUp from "react-countup";

export default function AccountPage() {
    const { wallet, address, browserWallet, stakeAddress } = useWallet();
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        (async () => {
            if (browserWallet) {
                try {
                    const balance = await browserWallet.getLovelace();
                    setBalance(Number(balance));
                } catch (_) {
                    setTimeout(async () => {
                        try {
                            const retryBalance = await browserWallet.getLovelace();
                            setBalance(Number(retryBalance));
                        } catch (_) {}
                    }, 2000);
                }
            } else {
                setBalance(0);
            }
        })();
    }, [browserWallet, wallet]);

    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
        >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-purple-500/5 blur-3xl" />
                <div className="absolute -bottom-[40%] -right-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-3xl" />
                <div className="absolute top-[20%] left-[50%] w-[40%] h-[40%] rounded-full bg-purple-500/3 blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8">
                {/* Header */}
                <motion.header
                    className="space-y-2"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                        Account Settings
                    </h1>
                    <p className="text-gray-400">Manage your wallet and account preferences</p>
                </motion.header>

                {/* Cards Grid */}
                <motion.div
                    className="grid gap-6 md:grid-cols-2"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {/* Wallet Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card className="hover:border-purple-500/30">
                            <CardHeader>
                                <CardTitle>Wallet Information</CardTitle>
                                <CardDescription>Your connected wallet details and balance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16">
                                            <Image
                                                className="h-full w-full rounded-full object-cover p-2 bg-purple-500/20 group-hover:scale-110 transition-transform duration-300"
                                                src={wallet?.icon || ""}
                                                width={64}
                                                height={64}
                                                alt={`${wallet?.name} icon`}
                                            />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold capitalize bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                                {wallet?.name}
                                            </h3>
                                            <p className="text-gray-400">{APP_NETWORK}</p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg bg-gray-700/30 p-4 hover:bg-purple-500/10 hover:scale-[1.02] transform transition-all duration-300">
                                        <p className="text-sm text-gray-400">Current Balance</p>
                                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                                            <CountUp
                                                start={0}
                                                end={Number((balance / DECIMAL_PLACE).toFixed(6))}
                                                decimals={6}
                                            />{" "}
                                            ₳
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Address Information */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Card className="hover:border-purple-500/30">
                            <CardHeader>
                                <CardTitle>Address Information</CardTitle>
                                <CardDescription>Your wallet addresses</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-400">Stake Address</p>
                                        <div className="flex items-center justify-between rounded-lg bg-gray-700/30 p-3 hover:bg-purple-500/10 group transition-all duration-300">
                                            <span className="text-sm font-mono text-white group-hover:text-purple-300 transition-colors">
                                                {shortenString(stakeAddress || "", 12)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 text-gray-400 hover:text-purple-400 transition-colors"
                                            >
                                                <Copy content={stakeAddress || ""} />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-400">Change Address</p>
                                        <div className="flex items-center justify-between rounded-lg bg-gray-700/30 p-3 hover:bg-purple-500/10 group transition-all duration-300">
                                            <span className="text-sm font-mono text-white group-hover:text-purple-300 transition-colors">
                                                {shortenString(address || "", 12)}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 text-gray-400 hover:text-purple-400 transition-colors"
                                            >
                                                <Copy content={address || ""} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Transaction History Card */}
                    <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <Card className="hover:border-purple-500/30">
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your recent transactions and activities</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-6 text-gray-400">
                                    Transaction history will be implemented in future updates
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}
