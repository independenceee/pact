"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Pagination from "~/components/pagination";
import Proposal, { ProposalSkeleton } from "~/components/proposal";
import { router } from "~/constants/router.constant";
import { useWallet } from "~/hooks/use-wallet";
import { getProposals } from "~/services/proposal.service";

const filters = ["All", "Active", "Completed", "Popular"] as const;

export default function Page() {
    const { address } = useWallet();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["proposals", { page, search, address }],
        queryFn: () =>
            getProposals({
                page: page,
                pageSize: 12,
                search: search,
                walletAddress: address as string,
            }),

        enabled: !!address,
    });
    return (
        <motion.div
            className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-8 px-4 sm:px-6 lg:px-8 relative"
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

            <div className="max-w-7xl mx-auto relative space-y-8">
                {/* Header Section */}
                <motion.header
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="space-y-2">
                        <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                            Proposals
                        </h1>
                        <p className="text-gray-400">Discover and support community initiatives</p>
                    </div>
                    <Link
                        className="group py-3 px-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-3 transform hover:scale-[1.02] active:scale-[0.98]"
                        href={router.create}
                    >
                        <span className="text-sm sm:text-base">Create Proposal</span>
                        <svg
                            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </Link>
                </motion.header>

                {/* Filters Section */}
                <motion.div
                    className="flex flex-wrap gap-3"
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {filters.map((filter, index) => (
                        <button
                            key={filter}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                index === 0
                                    ? "bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                                    : "bg-gray-800/40 text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"
                            }`}
                        >
                            {filter}
                        </button>
                    ))}
                </motion.div>

                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 py-10">
                        {[...Array(9)].map((_, index) => (
                            <ProposalSkeleton key={index} />
                        ))}
                    </div>
                )}

                {isError && (
                    <div className="flex justify-center py-10 text-red-400 text-lg font-semibold bg-red-900/20 rounded-xl shadow-md">
                        Failed to fetch proposals. Please try again.
                    </div>
                )}

                {!isLoading && (data?.proposals?.length ?? 0) > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {(data?.proposals ?? []).map((proposal: any) => (
                            <div
                                key={proposal.id}
                                className="transition-all duration-200 hover:scale-[1.025] hover:shadow-2xl shadow-lg rounded-xl bg-gray-800/60"
                            >
                                <Proposal
                                    href={router.proposal + "/" + proposal.id}
                                    id={proposal.id}
                                    image={proposal.image}
                                    current={proposal.current}
                                    description={proposal.description}
                                    startTime={proposal.startTime}
                                    status={proposal.status}
                                    target={proposal.target}
                                    title={proposal.title}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {!isLoading && !data?.proposals?.length && (
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-gray-300">
                        <div className="relative flex flex-col items-center justify-center  p-4 ">
                            <svg
                                className="w-16 h-16 mb-4 text-purple-400 animate-pulse"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 17v-2a4 4 0 014-4h3m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                                />
                            </svg>

                            <h3 className="text-xl font-semibold text-white mb-2">No Proposals Available</h3>

                            <p className="text-sm text-gray-400 text-center max-w-md">
                                It looks like there are no proposals at the moment. Check back later or create a new
                                proposal to get started!
                            </p>

                            <Link
                                href="/create-proposal"
                                className="mt-6 inline-block bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-2 px-6 rounded-full hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                            >
                                Create a Proposal
                            </Link>
                        </div>
                    </div>
                )}
                {data?.totalPages && data.totalPages > 1 && (
                    <Pagination currentPage={page} setCurrentPage={setPage} totalPages={data.totalPages} />
                )}
            </div>
        </motion.div>
    );
}
