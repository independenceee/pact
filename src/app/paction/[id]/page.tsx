"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import Pagination from "~/components/pagination";
import Status from "~/components/status";
import { DECIMAL_PLACE, HeadStatus } from "~/constants/common.constant";
import { useHydra } from "~/hooks/use-hydra";
import { useWallet } from "~/hooks/use-wallet";
import { shortenString } from "~/libs/utils";
import { commit, contribute, getUTxOsFromHydra, submitHydraTx } from "~/services/hydra.service";
import { getUTxOOnlyLovelace, submitTx } from "~/services/mesh.service";
import { getProposalByID } from "~/services/proposal.service";
import { CommitSchema, ContributeSchema } from "~/utils/schema";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type CommitFormType = z.infer<typeof CommitSchema>;
type ContributeSchemaType = z.infer<typeof ContributeSchema>;

export default function Page() {
    const params = useParams();
    const { address, signTx } = useWallet();
    const { status: headStatus } = useHydra();
    const { status: sessionStatus } = useSession();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["proposal", params.id],
        queryFn: () => getProposalByID(params.id as string),
        enabled: !!params.id,
    });

    const { data: utxosLovelaceOnly, isLoading: isLoadingUtxosLovelaceOnly } = useQuery({
        queryKey: ["utxos", address],
        queryFn: () =>
            getUTxOOnlyLovelace({
                walletAddress: address as string,
                quantity: (Number(data?.proposal?.target) * DECIMAL_PLACE) / Number(data?.proposal?.participants),
            }),
        enabled: !!address && sessionStatus === "authenticated" && !!data,
    });

    const { data: utxosHydra, isLoading: isLoadingUTxOsHydra } = useQuery({
        queryKey: ["utxos", address],
        queryFn: () =>
            getUTxOsFromHydra({
                walletAddress: address as string,
            }),
        enabled: !!address && sessionStatus === "authenticated" && !!data,
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<CommitFormType>({
        resolver: zodResolver(CommitSchema),
        defaultValues: { selectedUtxo: "" },
    });

    const {
        register: contributeRegister,
        handleSubmit: contributeHandleSubmit,
        formState: { errors: contributeErrors },
        reset: contributeReset,
    } = useForm<ContributeSchemaType>({
        resolver: zodResolver(ContributeSchema),
        defaultValues: { amount: 0 },
    });

    const onCommit = async (data: CommitFormType) => {
        try {
            setIsSubmitting(true);
            const parsed = JSON.parse(data.selectedUtxo);
            const unsignedTxCommit = await commit({
                walletAddress: address as string,
                isCreator: false,
                input: {
                    outputIndex: parsed.outputIndex as number,
                    txHash: parsed.txHash as string,
                },
                status: headStatus,
            });
            const signedTxCommit = await signTx(unsignedTxCommit);
            await submitTx({ signedTx: signedTxCommit });
            toast.success("Commit Funds UTxO successfully!");
            reset();
        } catch (error) {
            toast.error(String(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const onContribute = async ({ amount }: ContributeSchemaType) => {
        try {
            setIsSubmitting(true);
            const unsignedTx = await contribute({
                walletAddress: address as string,
                isCreator: true,
                quantity: amount,
                destination: data?.proposal?.destination as string,
                required: data?.proposal?.target as number,
            });
            const signedTx = await signTx(unsignedTx as string);
            await submitHydraTx({ signedTx: signedTx, isCreator: true });
            toast.success("Contribute completed successfully");
            contributeReset();
        } catch (error) {
            toast.error("Contribute fund with value fails");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate user's contribution from transactions
    const userContribution =
        data?.proposal?.transactions
            ?.filter((tx: any) => tx.wallet === address)
            ?.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0) || 0;

    const handleWithdraw = async () => {
        try {
            toast.info("Withdraw functionality not implemented yet.");
        } catch (error) {
            toast.error("Failed to withdraw funds.");
        }
    };

    return (
        <main className="font-sans bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pt-24 pt-30 flex flex-col gap-4">
                <Status />
                {isLoading ? (
                    <div className="animate-pulse space-y-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="md:w-1/2 h-96 bg-gray-700/50 rounded-xl" />
                            <div className="md:w-1/2 space-y-4">
                                <div className="h-8 w-3/4 bg-gray-700/50 rounded" />
                                <div className="h-4 w-full bg-gray-700/50 rounded" />
                                <div className="h-4 w-5/6 bg-gray-700/50 rounded" />
                                <div className="h-10 w-1/2 bg-gray-700/50 rounded-full" />
                            </div>
                        </div>
                    </div>
                ) : data?.proposal ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: false, amount: 0.1 }}
                            className="space-y-4 z-10 "
                        >
                            <img
                                className="w-full h-96 object-cover rounded-xl shadow-lg"
                                src={data?.proposal.image}
                                alt={data?.proposal.title}
                                width={600}
                                height={400}
                            />
                            <Card className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-full bg-gray-900/50 p-2">
                                                <svg
                                                    className="h-6 w-6 text-purple-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-300">Total Balance Tipped</p>
                                                <p className="text-xl font-semibold text-white">
                                                    <CountUp
                                                        start={0}
                                                        end={Number(data?.proposal.current || 0) / DECIMAL_PLACE}
                                                        decimals={4}
                                                    />{" "}
                                                    ADA
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-all disabled:opacity-50"
                                            onClick={handleWithdraw}
                                            disabled={data?.proposal.current === 0}
                                            aria-label="Withdraw balance"
                                        >
                                            Withdraw
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                        <div className="space-y-6">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-bold text-white hover:text-purple-400 transition-colors"
                            >
                                {data?.proposal.title}
                            </motion.h2>
                            <div className="space-y-2">
                                <div className="w-full bg-gray-700 rounded-full h-3">
                                    <motion.div
                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{
                                            width: `${Math.min(
                                                100,
                                                (data?.proposal.current / data?.proposal.target) * 100,
                                            )}%`,
                                        }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <p className="text-sm text-gray-300">
                                    Funded:{" "}
                                    {Math.min(100, (data?.proposal.current / data?.proposal.target) * 100).toFixed(0)}%
                                    • Participants: {data?.proposal.participants} • Required: {data?.proposal.target}{" "}
                                    ADA / Participant
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <img
                                        className="h-12 w-12 rounded-full object-cover ring-2 ring-purple-500/30"
                                        src="https://randomuser.me/api/portraits/lego/1.jpg"
                                        alt="Avatar"
                                        width={48}
                                        height={48}
                                    />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white hover:text-purple-400 transition-colors">
                                        {shortenString(data?.proposal.destination) || "Jane Doe"}
                                    </h3>
                                    <p className="text-sm text-gray-300">Balance: {data?.proposal.current || 0} ADA</p>
                                </div>
                            </div>

                            {headStatus === HeadStatus.OPEN && (
                                <form onSubmit={contributeHandleSubmit(onContribute)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Amount to Contribute (ADA)
                                        </label>
                                        <input
                                            type="number"
                                            {...contributeRegister("amount", { valueAsNumber: true })}
                                            className={`w-full bg-gray-800/80 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 ${
                                                contributeErrors.amount ? "ring-red-500" : "ring-purple-500"
                                            } transition-all`}
                                            placeholder="Enter amount in ADA"
                                        />
                                        {contributeErrors.amount && (
                                            <p className="text-red-400 text-sm mt-1">
                                                {contributeErrors.amount.message}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className={`w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 ${
                                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                                    />
                                                </svg>
                                                Contributing...
                                            </>
                                        ) : (
                                            "Contribute"
                                        )}
                                    </button>
                                </form>
                            )}

                            {headStatus === HeadStatus.INITIALIZING && (
                                <form onSubmit={handleSubmit(onCommit)} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">
                                            Select ADA to Commit
                                        </label>
                                        <div className="relative">
                                            <select
                                                {...register("selectedUtxo")}
                                                className={`w-full bg-gray-800/80 text-white py-3 px-4 rounded-lg focus:outline-none focus:ring-2 ${
                                                    errors.selectedUtxo ? "ring-red-500" : "ring-purple-500"
                                                } transition-all appearance-none`}
                                                disabled={isLoadingUtxosLovelaceOnly}
                                            >
                                                <option value="">
                                                    {isLoadingUtxosLovelaceOnly ? "Loading..." : "Select ADA Amount"}
                                                </option>
                                                {utxosLovelaceOnly?.map((utxo, index: number) => (
                                                    <option key={index} value={JSON.stringify(utxo)}>
                                                        {(utxo.amount / DECIMAL_PLACE).toFixed(2)} ADA
                                                    </option>
                                                ))}
                                            </select>
                                            <svg
                                                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M19 9l-7 7-7-7"
                                                />
                                            </svg>
                                        </div>
                                        {errors.selectedUtxo && (
                                            <p className="text-red-400 text-sm mt-1">{errors.selectedUtxo.message}</p>
                                        )}
                                    </div>
                                    <button
                                        type="submit"
                                        className={`w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2 ${
                                            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg
                                                    className="animate-spin h-5 w-5 text-white"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                                    />
                                                </svg>
                                                Submitting...
                                            </>
                                        ) : (
                                            "Commit"
                                        )}
                                    </button>
                                </form>
                            )}

                            <div>
                                <h3 className="text-lg font-semibold text-gray-200">Description</h3>
                                <p className="text-sm text-gray-300">{data?.proposal.description}</p>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card className="bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50 transition-all">
                                    <CardHeader>
                                        <CardTitle className="text-white flex items-center gap-2">
                                            <svg
                                                className="w-6 h-6 text-purple-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            Address Information
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <motion.div
                                            className="space-y-4"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            {/* User's Wallet Address */}
                                            {address ? (
                                                <motion.div
                                                    className="flex items-center gap-4 p-3 bg-gray-700/20 rounded-lg hover:bg-purple-500/10 transition-all"
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                >
                                                    <div className="relative">
                                                        <img
                                                            className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/30"
                                                            src="https://randomuser.me/api/portraits/lego/1.jpg"
                                                            alt="User Avatar"
                                                            width={40}
                                                            height={40}
                                                        />
                                                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-800" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-sm font-semibold text-white hover:text-purple-400 transition-colors">
                                                            {shortenString(address, 6, 4)}
                                                        </h3>
                                                        <p className="text-xs text-gray-300">
                                                            Your Contribution:{" "}
                                                            {(userContribution / DECIMAL_PLACE).toFixed(4)} ₳
                                                        </p>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <p className="text-gray-400 text-sm">
                                                    Connect your wallet to view your address.
                                                </p>
                                            )}

                                            {/* Other Participants */}
                                            {data?.proposal?.participantsList?.length > 0 ? (
                                                data.proposal.participantsList
                                                    .filter((participant) => participant.address !== address)
                                                    .slice(0, 3) // Limit to 3 participants to avoid clutter
                                                    .map((participant, index) => (
                                                        <motion.div
                                                            key={index}
                                                            className="flex items-center gap-4 p-3 bg-gray-700/20 rounded-lg hover:bg-purple-500/10 transition-all"
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: 0.6 + index * 0.1 }}
                                                        >
                                                            <div className="relative">
                                                                <img
                                                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-purple-500/30"
                                                                    src="https://randomuser.me/api/portraits/lego/1.jpg"
                                                                    alt="Participant Avatar"
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <h3 className="text-sm font-semibold text-white hover:text-purple-400 transition-colors">
                                                                    {shortenString(participant.address, 6, 4)}
                                                                </h3>
                                                                <p className="text-xs text-gray-300">
                                                                    Contribution:{" "}
                                                                    {(participant.contribution || 0) / DECIMAL_PLACE} ₳
                                                                </p>
                                                            </div>
                                                        </motion.div>
                                                    ))
                                            ) : (
                                                <p className="text-gray-400 text-sm">No other participants yet.</p>
                                            )}
                                            {data?.proposal?.participantsList?.length > 3 && (
                                                <p className="text-gray-400 text-xs mt-2">
                                                    +{data?.proposal?.participantsList.length - 3} more participants
                                                </p>
                                            )}
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-400 py-20 text-lg">Proposal not found.</div>
                )}

                <section className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-200 mb-4">Recent Transactions</h3>
                    <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-700/30">
                                    <th className="py-4 px-6 text-gray-200 font-semibold">Transaction Hash</th>
                                    <th className="py-4 px-6 text-gray-200 font-semibold">Wallet Address</th>
                                    <th className="py-4 px-6 text-gray-200 font-semibold text-right">Amount</th>
                                    <th className="py-4 px-6 text-gray-200 font-semibold text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="border-b border-gray-700/50 animate-pulse">
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-32 bg-gray-700/50 rounded" />
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="h-4 w-32 bg-gray-700/50 rounded" />
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <div className="h-4 w-16 bg-gray-700/50 rounded" />
                                            </td>
                                            <td className="py-4 px-6 text-center">
                                                <div className="h-4 w-20 bg-gray-700/50 rounded" />
                                            </td>
                                        </tr>
                                    ))
                                ) : data?.proposal?.transactions?.length ? (
                                    data?.proposal.transactions.map((tx: any, i: number) => (
                                        <motion.tr
                                            key={i}
                                            className="border-b border-gray-700/50 hover:bg-purple-500/10 transition-colors"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 + i * 0.1 }}
                                        >
                                            <td className="py-4 px-6 text-gray-300 font-mono">
                                                {shortenString(tx.hash)}
                                            </td>
                                            <td className="py-4 px-6 text-gray-300 font-mono">
                                                {shortenString(tx.wallet)}
                                            </td>
                                            <td className="py-4 px-6 text-right text-gray-300">{tx.amount} ADA</td>
                                            <td className="py-4 px-6 text-center">
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        tx.status === "Confirmed"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-yellow-500/20 text-yellow-400"
                                                    }`}
                                                >
                                                    {tx.status}
                                                </span>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center text-gray-400 py-8">
                                            No transactions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {data?.proposal?.transactions?.length > 0 && (
                        <div className="flex justify-center mt-6">
                            <Pagination currentPage={1} setCurrentPage={null!} totalPages={2} />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
