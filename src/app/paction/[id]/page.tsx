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

    const onSubmit = async (data: CommitFormType) => {
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
            console.log(unsignedTx);
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

    return (
        <main className="font-sans bg-gray-900 snap-y snap-mandatory">
            <div className="bg-gray-900 dark:bg-gray-900 py-8">
                <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 flex flex-col gap-4">
                    <Status />
                    {isLoading ? (
                        <div className="flex flex-col md:flex-row -mx-4 animate-pulse">
                            <div className="md:flex-1 px-4">
                                <div className="h-[460px] rounded-lg bg-gray-800/80 mb-4 flex items-center justify-center" />
                            </div>
                            <div className="md:flex-1 px-4 flex flex-col gap-4">
                                <div className="h-8 w-3/4 bg-gray-700/60 rounded mb-2" />
                                <div className="flex flex-col gap-2 mb-4">
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full w-1/2" />
                                    </div>
                                    <div className="h-4 w-1/2 bg-gray-700/60 rounded mt-2" />
                                </div>
                                <div className="mb-4 flex flex-col gap-2">
                                    <div className="h-6 w-32 bg-gray-700/60 rounded mb-2" />
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-full bg-gray-700/60" />
                                        <div className="flex flex-col gap-2">
                                            <div className="h-5 w-24 bg-gray-700/60 rounded" />
                                            <div className="h-4 w-16 bg-gray-700/50 rounded" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-4 mb-4">
                                    <div className="w-1/2 h-10 bg-gray-700/60 rounded-full" />
                                    <div className="w-1/2 h-10 bg-gray-700/60 rounded-full" />
                                </div>
                                <div>
                                    <div className="h-5 w-40 bg-gray-700/60 rounded mb-2" />
                                    <div className="h-4 w-full bg-gray-700/50 rounded mb-1" />
                                    <div className="h-4 w-5/6 bg-gray-700/50 rounded mb-1" />
                                    <div className="h-4 w-2/3 bg-gray-700/50 rounded" />
                                </div>
                            </div>
                        </div>
                    ) : data?.proposal ? (
                        <div className="flex flex-col md:flex-row -mx-4 h-full">
                            <div className="md:flex-1 px-4 h-full">
                                <div className="rounded-lg h-full bg-gray-800/80 dark:bg-gray-800/80 mb-4">
                                    <img
                                        className="w-full h-full object-cover rounded"
                                        src={data?.proposal.image}
                                        alt={data?.proposal.title}
                                    />
                                </div>
                            </div>
                            <div className="md:flex-1 px-4">
                                <h2 className="text-2xl font-bold text-white dark:text-white mb-2 hover:text-purple-400">
                                    {data?.proposal.title}
                                </h2>
                                <div className="mb-4">
                                    <div className="flex mt-2 flex-col">
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        (data?.proposal.current / data?.proposal.target) * 100,
                                                    ).toFixed(0)}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-2">
                                            Funded:{" "}
                                            {Math.min(
                                                100,
                                                (data?.proposal.current / data?.proposal.target) * 100,
                                            ).toFixed(0)}
                                            % --- Participants: {data?.proposal.participants} --- Required:{" "}
                                            {data?.proposal.target} ADA / Participant
                                        </p>
                                    </div>
                                </div>
                                <div className="mb-4 flex flex-col gap-2">
                                    <span className="font-bold text-gray-300 dark:text-gray-300">Destination:</span>
                                    <div className="flex flex-1 items-center mb-4 shadow-lg hover:shadow-purple-500/10">
                                        <div className="relative">
                                            <img
                                                className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-700/50 dark:ring-gray-700/50"
                                                src="https://randomuser.me/api/portraits/lego/1.jpg"
                                                alt="Avatar"
                                            />
                                            <div className="absolute inset-0 rounded-full shadow-inner"></div>
                                        </div>
                                        <div className="ml-4">
                                            <h2 className="font-bold text-white dark:text-white text-lg hover:text-purple-400">
                                                {shortenString(data?.proposal.destination) || "Jane Doe"}
                                            </h2>
                                            <p className="text-gray-300 dark:text-gray-300">
                                                Balance: {data?.proposal.current || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {headStatus === HeadStatus.OPEN && (
                                    <form
                                        className="flex -mx-2 mb-4 items-end"
                                        onSubmit={contributeHandleSubmit(onContribute)}
                                    >
                                        <div className="w-2/3 px-2">
                                            <label
                                                htmlFor="amount"
                                                className="block text-gray-300 dark:text-gray-300 text-sm font-bold mb-2"
                                            >
                                                Enter the amount of ada contributed
                                            </label>
                                            <input
                                                type="number"
                                                {...contributeRegister("amount", { valueAsNumber: true })}
                                                className={`w-full bg-gray-800/80 dark:bg-gray-800/80 text-gray-300 dark:text-gray-300 py-2 px-4 rounded-full focus:outline-none focus:ring-2 ${
                                                    contributeErrors.amount
                                                        ? "focus:ring-red-500"
                                                        : "focus:ring-purple-600"
                                                }`}
                                                placeholder="Nhập số..."
                                            />
                                        </div>
                                        <div className="w-1/3 px-2">
                                            <button
                                                type="submit"
                                                className={`w-full bg-purple-600/80 text-white py-2 px-4 rounded-full font-bold hover:bg-purple-700/90 transition-all flex items-center justify-center gap-2 ${
                                                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                                }`}
                                                disabled={isSubmitting}
                                                aria-disabled={isSubmitting}
                                                aria-label={isSubmitting ? "Contributing transaction" : "Contribute"}
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
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                                            ></path>
                                                        </svg>
                                                        Contributing...
                                                    </>
                                                ) : (
                                                    "Commit"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {headStatus === HeadStatus.INITIALIZING && (
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="flex items-end gap-2 w-full mb-2"
                                    >
                                        <div className="w-2/3  relative">
                                            <label
                                                htmlFor="amount"
                                                className="block text-gray-300 dark:text-gray-300 text-sm font-bold mb-2"
                                            >
                                                Choose the amount of ada commit
                                            </label>
                                            <select
                                                {...register("selectedUtxo")}
                                                className={`w-full appearance-none bg-gray-800/90 text-gray-200 py-2 px-5 pr-12 rounded-full font-medium text-sm border ${
                                                    errors.selectedUtxo
                                                        ? "border-red-500 focus:ring-red-500"
                                                        : "border-gray-700/50 focus:ring-purple-500"
                                                } focus:outline-none transition-all duration-300 cursor-pointer shadow-sm`}
                                                aria-label="Select ADA amount to commit"
                                                disabled={isLoadingUtxosLovelaceOnly}
                                            >
                                                <option value="">
                                                    {isLoadingUtxosLovelaceOnly ? "Loading ..." : "Select ADA Amount"}
                                                </option>
                                                {utxosLovelaceOnly?.map((utxo, index: number) => (
                                                    <option key={index} value={JSON.stringify(utxo)}>
                                                        {(utxo.amount / DECIMAL_PLACE).toFixed(2)} ADA
                                                    </option>
                                                ))}
                                            </select>

                                            <div className="absolute top-10 right-4 flex items-center pointer-events-none">
                                                <svg
                                                    className="w-4 h-4 text-gray-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        <div className="w-1/3 px-2">
                                            <button
                                                type="submit"
                                                className={`w-full bg-purple-600/80 text-white py-2 px-4 rounded-full font-bold hover:bg-purple-700/90 transition-all flex items-center justify-center gap-2 ${
                                                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                                                }`}
                                                disabled={isSubmitting}
                                                aria-disabled={isSubmitting}
                                                aria-label={isSubmitting ? "Submitting transaction" : "Commit funds"}
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
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                                                            ></path>
                                                        </svg>
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    "Commit"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                                {errors.selectedUtxo && (
                                    <p className="text-red-400 text-sm mt-2">{errors.selectedUtxo.message}</p>
                                )}
                                {contributeErrors.amount && (
                                    <p className="text-red-500 text-sm mt-1">{contributeErrors.amount.message}</p>
                                )}
                                <div>
                                    <span className="font-bold text-gray-300 dark:text-gray-300">
                                        Product Description:
                                    </span>
                                    <p className="text-gray-300 dark:text-gray-300 text-sm mt-2">
                                        {data?.proposal.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-20 text-lg">data?.proposal not found.</div>
                    )}

                    <section className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-200">Recent Transactions</h3>
                        <div className="overflow-x-auto bg-gray-800/40 rounded-lg backdrop-blur-sm border border-gray-700/30">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-700/50">
                                        <th className="py-4 px-6 text-left text-gray-300 font-semibold">
                                            Transaction Hash
                                        </th>
                                        <th className="py-4 px-6 text-left text-gray-300 font-semibold">
                                            Wallet Address
                                        </th>
                                        <th className="py-4 px-6 text-right text-gray-300 font-semibold">Amount</th>
                                        <th className="py-4 px-6 text-center text-gray-300 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {isLoading ? (
                                        [...Array(5)].map((_, i) => (
                                            <tr key={i} className="border-b border-gray-700/50 animate-pulse">
                                                <td className="py-4 px-6">
                                                    <div className="h-4 w-32 bg-gray-700/60 rounded" />
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="h-4 w-32 bg-gray-700/60 rounded" />
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    <div className="h-4 w-16 bg-gray-700/60 rounded ml-auto" />
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="h-4 w-20 bg-gray-700/60 rounded mx-auto" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : data?.proposal?.transactions?.length ? (
                                        data?.proposal.transactions.map((tx: any, i: number) => (
                                            <tr
                                                key={i}
                                                className="border-b border-gray-700/50 hover:bg-purple-500/5 transition-colors"
                                            >
                                                <td className="py-4 px-6 text-gray-300 font-mono">{tx.hash}</td>
                                                <td className="py-4 px-6 text-gray-300 font-mono">{tx.wallet}</td>
                                                <td className="py-4 px-6 text-right text-gray-300">{tx.amount} ADA</td>
                                                <td className="py-4 px-6 text-center">
                                                    <span
                                                        className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            tx.status === "Confirmed"
                                                                ? "bg-green-500/20 text-green-400"
                                                                : "bg-yellow-500/20 text-yellow-400"
                                                        }`}
                                                    >
                                                        {tx.status}
                                                    </span>
                                                </td>
                                            </tr>
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
                        {data?.proposal?.transactions && data?.proposal.transactions.length > 0 && (
                            <div className="flex justify-center mt-6">
                                <Pagination currentPage={1} setCurrentPage={null!} totalPages={2} />
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
