"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams } from "next/navigation";
import Pagination from "~/components/pagination";
import Status from "~/components/status";
import { shortenString } from "~/libs/utils";
import { getProposalByID } from "~/services/proposal.service";

export default function Page() {
    const params = useParams();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["proposal", params.id],
        queryFn: () => getProposalByID(params.id as string),
        enabled: !!params.id,
    });

    const proposal = data?.proposal;
    console.log(proposal?.image);

    return (
        <main className="font-sans bg-gray-900 snap-y snap-mandatory">
            <div className="bg-gray-900 dark:bg-gray-900 py-8">
                <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 flex flex-col gap-4">
                    <Status />
                    {isLoading ? (
                        <div className="flex flex-col md:flex-row -mx-4 animate-pulse">
                            <div className="md:flex-1 px-4">
                                <div className="h-[460px] rounded-lg bg-gray-800/80 mb-4 flex items-center justify-center">
                                    <div className="w-2/3 h-2/3 bg-gray-700/60 rounded-lg" />
                                </div>
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
                    ) : proposal ? (
                        <div className="flex flex-col md:flex-row -mx-4">
                            <div className="md:flex-1 px-4">
                                <div className="rounded-lg bg-gray-800/80 dark:bg-gray-800/80 mb-4">
                                    <img
                                        className="w-full h-full object-cover rounded"
                                        src={
                                            proposal.image && proposal.image.startsWith("http")
                                                ? proposal.image
                                                : "https://res.cloudinary.com/des4z4tss/image/upload/v1759758623/p6lyoonpu5gbw238f50v.jpg"
                                        }
                                        alt={proposal.title}
                                    />
                                </div>
                            </div>
                            <div className="md:flex-1 px-4">
                                <h2 className="text-2xl font-bold text-white dark:text-white mb-2 hover:text-purple-400">
                                    {proposal.title}
                                </h2>
                                <div className="mb-4">
                                    <div className="flex mt-2 flex-col">
                                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                                            <div
                                                className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        (proposal.current / proposal.target) * 100,
                                                    ).toFixed(0)}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-2">
                                            Funded:{" "}
                                            {Math.min(100, (proposal.current / proposal.target) * 100).toFixed(0)}% ---
                                            Participants: {proposal.participants} --- Required: {proposal.target} ADA /
                                            Participant
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
                                                {shortenString(proposal.destination) || "Jane Doe"}
                                            </h2>
                                            <p className="text-gray-300 dark:text-gray-300">
                                                {proposal.current || "User"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex -mx-2 mb-4">
                                    <div className="w-1/2 px-2">
                                        <button className="w-full bg-purple-600/80 dark:bg-purple-600/80 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-700/90 dark:hover:bg-gray-700/90">
                                            Add to Cart
                                        </button>
                                    </div>
                                    <div className="w-1/2 px-2">
                                        <button className="w-full bg-gray-800/80 dark:bg-gray-800/80 text-gray-300 dark:text-gray-300 py-2 px-4 rounded-full font-bold hover:bg-gray-700/90 dark:hover:bg-gray-700/90">
                                            Add to Wishlist
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-300 dark:text-gray-300">
                                        Product Description:
                                    </span>
                                    <p className="text-gray-300 dark:text-gray-300 text-sm mt-2">
                                        {proposal.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 py-20 text-lg">Proposal not found.</div>
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
                                    ) : proposal?.transactions?.length ? (
                                        proposal.transactions.map((tx: any, i: number) => (
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
                        {proposal?.transactions && proposal.transactions.length > 0 && (
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
