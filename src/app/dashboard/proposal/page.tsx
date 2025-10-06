"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Pagination from "~/components/pagination";
import Proposal from "~/components/proposal";
import { router } from "~/constants/router.constant";

const filters = ["All", "Active", "Completed", "Popular"] as const;

export default function Page() {
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

                {/* Projects Grid */}
                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {proposals.map((proposal, index) => (
                        <motion.div
                            key={proposal.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.5 }}
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
                        </motion.div>
                    ))}
                </motion.div>

                {/* Pagination */}
                <motion.div
                    className="flex justify-center mt-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <Pagination currentPage={1} setCurrentPage={null!} totalPages={10} />
                </motion.div>
            </div>
        </motion.div>
    );
}

const proposals = [
    {
        id: "clxyz1234567890abcdef123456",
        title: "Best View in New York City",
        image: "https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Support our fundraiser for urban conservation.",
        status: "OPEN",
        destination: "0xCommunityWallet1234567890abcdef1234567890",
        target: 1000,
        current: 200,
        participants: 2,
        startTime: new Date("2025-03-27T00:00:00Z"),
        endTime: new Date("2025-05-27T00:00:00Z"),
        createdAt: new Date("2025-03-01T12:00:00Z"),
        updatedAt: new Date("2025-03-01T12:00:00Z"),
        userId: "user_id_1",
    },
    {
        id: "clxyz0987654321abcdef123456",
        title: "Best Pizza in Town",
        image: "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Fundraiser for local food banks with pizza events.",
        status: "OPEN",
        destination: "0xFoodWalletabcdef1234567890abcdef12345678",
        target: 500,
        current: 100,
        participants: 1,
        startTime: new Date("2025-03-20T00:00:00Z"),
        endTime: new Date("2025-04-20T00:00:00Z"),
        createdAt: new Date("2025-03-01T12:00:00Z"),
        updatedAt: new Date("2025-03-01T12:00:00Z"),
        userId: "user_id_2",
    },
    {
        id: "clxyz4567891230abcdef123456",
        title: "Best Salad Images Ever",
        image: "https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Support healthy eating initiatives with our fundraiser.",
        status: "OPEN",
        destination: "0xHealthWallet1234567890abcdef1234567890",
        target: 800,
        current: 300,
        participants: 3,
        startTime: new Date("2025-04-15T00:00:00Z"),
        endTime: new Date("2025-06-15T00:00:00Z"),
        createdAt: new Date("2025-03-01T12:00:00Z"),
        updatedAt: new Date("2025-03-01T12:00:00Z"),
        userId: "user_id_1",
    },

    {
        id: "clxyz1234567890abcdef123456",
        title: "Best View in New York City",
        image: "https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Support our fundraiser for urban conservation.",
        status: "OPEN",
        destination: "0xCommunityWallet1234567890abcdef1234567890",
        target: 1000,
        current: 200,
        participants: 2,
        startTime: new Date("2025-03-27T00:00:00Z"),
        endTime: new Date("2025-05-27T00:00:00Z"),
        createdAt: new Date("2025-03-01T12:00:00Z"),
        updatedAt: new Date("2025-03-01T12:00:00Z"),
        userId: "user_id_1",
    },
    {
        id: "clxyz0987654321abcdef123456",
        title: "Best Pizza in Town",
        image: "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Fundraiser for local food banks with pizza events.",
        status: "OPEN",
        destination: "0xFoodWalletabcdef1234567890abcdef12345678",
        target: 500,
        current: 100,
        participants: 1,
        startTime: new Date("2025-03-20T00:00:00Z"),
        endTime: new Date("2025-04-20T00:00:00Z"),
        createdAt: new Date("2025-03-01T12:00:00Z"),
        updatedAt: new Date("2025-03-01T12:00:00Z"),
        userId: "user_id_2",
    },
    {
        id: "clxyz4567891230abcdef123456",
        title: "Best Salad Images Ever",
        image: "https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        description: "Support healthy eating initiatives with our fundraiser.",
        status: "OPEN",
        destination: "0xHealthWallet1234567890abcdef1234567890",
        target: 800,
        current: 300,
        participants: 3,
        startTime: new Date("2025-04-15T00:00:00Z"),
        endTime: new Date("2025-06-15T00:00:00Z"),
        createdAt: new Date("2025-03-01T12:00:00Z"),
        updatedAt: new Date("2025-03-01T12:00:00Z"),
        userId: "user_id_1",
    },
];
