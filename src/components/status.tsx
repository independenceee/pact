"use client";

import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import { Button } from "./ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import { IoWarningOutline as Warn } from "react-icons/io5";
import { disburse, fanout, submitHydraTx } from "~/services/hydra.service";
import { HeadStatus } from "~/constants/common.constant";
import { useHydra } from "~/hooks/use-hydra";
import { useWallet } from "~/hooks/use-wallet";

const Status: React.FC = () => {
    const router = useRouter();
    const { address, signTx } = useWallet();
    const queryClient = useQueryClient();
    const { status, isLoading } = useHydra();
    const [loading, setLoading] = useState<boolean>(false);

    const isFanoutEligible = useMemo(
        () => [HeadStatus.OPEN, HeadStatus.CLOSED, HeadStatus.FANOUT_POSSIBLE].includes(status as HeadStatus),
        [status],
    );

    const handleFanout = useCallback(async () => {
        try {
            setLoading(true);
            if (status === HeadStatus.CLOSED || HeadStatus.FANOUT_POSSIBLE || HeadStatus.FINAL) {
                const unsignedTx = await disburse({ walletAddress: address as string, isCreator: true });
                const signedTx = await signTx(unsignedTx as string);
                await submitHydraTx({ signedTx: signedTx, isCreator: true });
            }
            await fanout({ status: status, isCreator: false });
            toast.success("Fanout completed successfully");

            queryClient.invalidateQueries({ queryKey: ["headStatus"] });
            router.push("/dashboard");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to fanout");
        } finally {
            setLoading(false);
        }
    }, [queryClient, router]);

    useEffect(() => {
        if (status === HeadStatus.CLOSED) {
            handleFanout();
        }
    }, [status, handleFanout]);

    // useEffect(() => {
    //     if (status === HeadStatus.IDLE) {
    //         handleFanout();
    //     }
    // }, [status, handleFanout]);

    return (
        <motion.div
            className="relative flex w-full items-center gap-4 rounded-lg border-l-4 border-purple-500 bg-gradient-to-r  p-4 shadow-md dark:border-purple-600 from-purple-900/20 to-gray-900"
            variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
            }}
            initial="hidden"
            animate="visible"
        >
            <motion.div
                className="flex-shrink-0 text-purple-500 dark:text-purple-400"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <Warn className="h-5 w-5" />
            </motion.div>
            <div className="min-w-0 flex-1">
                <motion.p
                    className="truncate text-sm font-medium text-purple-700 dark:text-purple-200"
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.2 }}
                >
                    There is now a head available for you to access, and below is the current state of your head
                </motion.p>
                <motion.div
                    className="flex items-center gap-2 text-xs font-bold uppercase text-purple-600 dark:text-purple-300"
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.3 }}
                >
                    Status:{" "}
                    {isLoading ? (
                        <ClipLoader color="#9333ea" size={14} />
                    ) : (
                        <span className="rounded-md bg-purple-100 px-2 py-1 dark:bg-purple-800/50">
                            {status || "Loading ..."}
                        </span>
                    )}
                </motion.div>
            </div>
            {isFanoutEligible && (
                <motion.div
                    variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
                    }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                disabled={isLoading}
                                className="w-full rounded-md bg-purple-500 py-3 px-8 text-base font-semibold text-white shadow-lg hover:bg-purple-600 disabled:opacity-50 dark:bg-purple-600 dark:hover:bg-purple-700"
                            >
                                {isLoading && loading ? "Fanouting..." : "Fanout"}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white dark:bg-gray-800">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-purple-700 dark:text-purple-200">
                                    Fanout to Layer 1
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
                                    This will fanout the current head, transferring services from layer 2 to layer 1.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700">
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleFanout}
                                    disabled={isLoading || loading}
                                    className="bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700"
                                >
                                    {isLoading ? "Fanouting..." : "Fanout"}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </motion.div>
            )}
        </motion.div>
    );
};

export default Status;
