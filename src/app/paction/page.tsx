"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Pagination from "~/components/pagination";
import Proposal, { ProposalSkeleton } from "~/components/proposal";
import { getProposals } from "~/services/proposal.service";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => setDebouncedSearch(search), 500);
        return () => clearTimeout(timeout);
    }, [search]);

    const { data, isLoading, isError } = useQuery({
        queryKey: ["proposals", { page, search }],
        queryFn: () =>
            getProposals({
                page: page,
                pageSize: 12,
                search: search,
            }),
    });

    return (
        <main className="font-sans bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 min-h-screen snap-y snap-mandatory">
            <section className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-center mb-4">
                        <h2 className="text-5xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400 drop-shadow-lg">
                            Hydra Pact Features
                        </h2>
                        <p className="text-gray-300 max-w-2xl text-xl mx-auto leading-relaxed">
                            Discover the cutting-edge tools and capabilities of Hydra Pact, designed to empower DeFi on
                            Cardano.
                        </p>
                    </div>
                    <div className="mt-6 w-full max-w-xl">
                        <div className="relative flex items-center gap-2 shadow-lg rounded-full bg-gray-800/60">
                            <span className="absolute left-4 text-purple-400">
                                <Search aria-hidden="true" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search fundraisers"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                className="w-full rounded-full pl-12 pr-4 py-3 text-gray-100 placeholder-gray-400 border-none bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-gray-900 transition-all duration-200"
                                aria-label="Search fundraisers"
                            />
                        </div>
                    </div>
                </div>

                {isLoading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 py-10">
                        {[...Array(9)].map((_, index) => (
                            // <div
                            //     key={i}
                            //     className="animate-pulse bg-gray-800/60 rounded-xl h-64 shadow-lg flex flex-col justify-center items-center"
                            // >
                            //     <div className="w-24 h-24 bg-gray-700 rounded-full mb-4" />
                            //     <div className="h-4 w-2/3 bg-gray-700 rounded mb-2" />
                            //     <div className="h-3 w-1/2 bg-gray-700 rounded" />
                            // </div>
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
            </section>
        </main>
    );
}
