"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Pagination from "~/components/pagination";
import Proposal from "~/components/proposal";
import { router } from "~/constants/router.constant";

export default function Page() {
    return (
        <motion.div className="container mx-auto flex flex-col gap-4">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                    Proposals
                </h1>
                <Link
                    className=" py-2 px-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-purple-500/40 transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                    href={router.create}
                >
                    Create Proposal
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </header>

            <aside>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                    {proposals.map((proposal, index) => (
                        <Proposal
                            key={index}
                            id={proposal.id}
                            image={proposal.image}
                            current={proposal.current}
                            description={proposal.description}
                            startTime={proposal.startTime}
                            status={proposal.status}
                            target={proposal.target}
                            title={proposal.title}
                        />
                    ))}
                </div>

                <Pagination currentPage={1} setCurrentPage={null!} totalPages={10} />
            </aside>
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
