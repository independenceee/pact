"use client";

import { shortenString } from "~/libs/utils";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { MdOutlineFeedback } from "react-icons/md";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useWallet } from "~/hooks/use-wallet";
import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { APP_NETWORK } from "~/constants/enviroments.constant";
import Copy from "~/components/copy";
import { Separator } from "~/components/ui/separator";
import { DECIMAL_PLACE } from "~/constants/common.constant";
import { Button } from "~/components/ui/button";

export default function Account() {
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
        <Popover>
            <PopoverTrigger
                className={
                    "items-center gap-2 rounded-3xl border border-purple-500/40 bg-gradient-to-r from-gray-900/80 to-gray-800/80 pr-4 pl-1 py-1 text-sm font-medium text-purple-200 shadow-xl transition-all duration-200 hover:border-purple-400 hover:bg-gray-800/90 hidden xl:inline-flex"
                }
            >
                <div className={"h-8 w-8"}>
                    <Image
                        className={
                            "h-full w-full rounded-full bg-gradient-to-br from-purple-400 to-blue-400 object-cover p-1 bg-slate-700"
                        }
                        src={wallet?.icon || ""}
                        width={32}
                        height={32}
                        alt={`${wallet?.icon} icon`}
                    />
                </div>
                <div className="">
                    <h2 className="text-[13px] leading-4 font-semibold  text-purple-200">
                        {address?.slice(0, 12)}...{address?.slice(-4)}
                    </h2>
                    <p className={"text-left text-[15px] leading-4 font-bold  text-blue-300"}>
                        <CountUp start={0} end={Number((balance / DECIMAL_PLACE).toFixed(6))} decimals={6} /> ₳
                    </p>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className={
                    "mt-2 flex min-w-[315px] flex-col gap-4 rounded-xl p-5    bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 border  border-purple-700/40 shadow-2xl"
                }
                align="end"
            >
                <div className="flex items-center gap-3">
                    <div className={"h-10 w-10"}>
                        <Image
                            className={
                                "h-full w-full object-cover rounded-full bg-gradient-to-br from-purple-400 to-blue-400"
                            }
                            src={wallet?.icon || ""}
                            alt={`${wallet?.name} icon`}
                            width={32}
                            height={32}
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold  text-purple-200 capitalize">
                            {wallet?.name}
                        </h2>
                        <p className="text-sm  text-blue-300 capitalize"> {APP_NETWORK}</p>
                    </div>
                </div>
                <Separator className="my-1  bg-purple-700/40" />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-sm  text-gray-400">Stake:</p>
                            <span className="text-sm  text-purple-200">
                                {shortenString(stakeAddress || "", 11)}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-purple-400  hover:text-purple-200"
                        >
                            <Copy className="h-4 w-4" content={stakeAddress || ""} />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-sm  text-gray-400">Change:</p>
                            <span className="text-sm  text-purple-200">
                                {shortenString(address || "", 10)}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-purple-400  hover:text-purple-200"
                        >
                            <Copy className="h-4 w-4" content={stakeAddress || ""} />
                        </Button>
                    </div>
                </div>
                <div className={"leading-0 h-[1px] overflow-hidden  bg-purple-700/40"} />
                <div className={"relative flex items-center"}>
                    <Link
                        className="flex cursor-pointer items-center gap-1  text-blue-300 hover:underline"
                        href={"/"}
                    >
                        <MdOutlineFeedback />
                        <span className="text-[14px]">Feedback</span>
                    </Link>
                </div>
                <div className={"relative flex items-center"}>
                    <Link
                        className="flex cursor-pointer items-center gap-1  text-blue-300 hover:underline"
                        href={"/"}
                    >
                        <IoIosHelpCircleOutline />
                        <span className="text-[14px]">Help</span>
                    </Link>
                </div>

                <div className={"leading-0 h-[1px] overflow-hidden  bg-purple-700/40"} />
                <div className={"flex flex-col items-center gap-3"}>
                    <Button
                        onClick={() => signOut()}
                        className={
                            "w-[180px] cursor-pointer rounded-[35px]   text-center text-[14px] leading-[25px]  font-semibold shadow-md hover:from-purple-500 hover:to-blue-500 bg-gradient-to-r from-purple-700 to-blue-700 text-white"
                        }
                    >
                        Log out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
