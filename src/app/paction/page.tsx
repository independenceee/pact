import { Search } from "lucide-react";
import Pagination from "~/components/pagination";
import Proposal from "~/components/proposal";

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
];

export default function Page() {
    return (
        <main className="font-sans bg-gray-900 snap-y snap-mandatory">
            <section className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16">
                {/* Search Section */}
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="text-center mb-4">
                        <h2 className="text-5xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            Hydra Pact Features
                        </h2>
                        <p className="text-gray-300 max-w-2xl text-xl mx-auto leading-relaxed">
                            Discover the cutting-edge tools and capabilities of Hydra Pact, designed to empower DeFi on
                            Cardano.
                        </p>
                    </div>
                    <div className="mt-6 w-full max-w-xl">
                        <div className="relative flex items-center gap-2">
                            <span className="absolute left-4 text-gray-400">
                                <Search aria-hidden="true" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search fundraisers"
                                className="w-full rounded-full pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                aria-label="Search fundraisers"
                            />
                        </div>
                    </div>
                </div>

                {/* Card Grid Section */}
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
            </section>
        </main>
    );
}
