import { Search } from "lucide-react";
import Pagination from "~/components/pagination";

// Sample data (replace with API fetch in a real app)
const fundraisers = [
    {
        id: 1,
        title: "Best View in New York City",
        description: "Support our fundraiser for urban conservation.",
        image: "https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        alt: "New York City skyline fundraiser",
        date: "2025-03-27",
        category: "Community",
        timeAgo: "6 mins ago",
    },
    {
        id: 2,
        title: "Best Pizza in Town",
        description: "Fundraiser for local food banks with pizza events.",
        image: "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        alt: "Pizza fundraiser event",
        date: "2025-03-20",
        category: "Food",
        timeAgo: "3 mins ago",
    },
    {
        id: 3,
        title: "Best Salad Images Ever",
        description: "Support healthy eating initiatives with our fundraiser.",
        image: "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        alt: "Salad fundraiser campaign",
        date: "2025-04-15",
        category: "Health",
        timeAgo: "6 mins ago",
    },
    {
        id: 1,
        title: "Best View in New York City",
        description: "Support our fundraiser for urban conservation.",
        image: "https://images.pexels.com/photos/196667/pexels-photo-196667.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        alt: "New York City skyline fundraiser",
        date: "2025-03-27",
        category: "Community",
        timeAgo: "6 mins ago",
    },
    {
        id: 2,
        title: "Best Pizza in Town",
        description: "Fundraiser for local food banks with pizza events.",
        image: "https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        alt: "Pizza fundraiser event",
        date: "2025-03-20",
        category: "Food",
        timeAgo: "3 mins ago",
    },
    {
        id: 3,
        title: "Best Salad Images Ever",
        description: "Support healthy eating initiatives with our fundraiser.",
        image: "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
        alt: "Salad fundraiser campaign",
        date: "2025-04-15",
        category: "Health",
        timeAgo: "6 mins ago",
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
                    {fundraisers.map((fundraiser) => (
                        <div
                            key={fundraiser.id}
                            className="rounded overflow-hidden shadow-lg bg-gray-800/80 backdrop-blur-md border border-gray-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 transform hover:-translate-y-2"
                        >
                            <div className="relative">
                                <a href={`/fundraiser/${fundraiser.id}`}>
                                    <img className="w-full" src={fundraiser.image} alt={fundraiser.alt} />
                                    <div className="hover:bg-transparent transition duration-300 absolute bottom-0 right-0 left-0 bg-gray-900/50 opacity-30" style={{ top: 0 }} />
                                </a>
                                <a href={`/category/${fundraiser.category.toLowerCase()}`}>
                                    <div className="absolute bottom-0 left-0 bg-purple-600/80 px-4 py-2 text-white text-sm hover:bg-gray-700/90 hover:text-purple-400 transition duration-500 ease-in-out">
                                        {fundraiser.category}
                                    </div>
                                </a>
                                <a href={`/fundraiser/${fundraiser.id}`}>
                                    <div className="text-sm absolute right-0 bg-purple-600/80 px-4 text-white rounded-full h-16 w-16 flex flex-col items-center justify-center mt-3 mr-3 hover:bg-gray-700/90 hover:text-purple-400 transition duration-500 ease-in-out" style={{ top: 0 }}>
                                        <span className="font-bold">{new Date(fundraiser.date).getDate()}</span>
                                        <small>
                                            {new Date(fundraiser.date).toLocaleString("default", { month: "long" })}
                                        </small>
                                    </div>
                                </a>
                            </div>
                            <div className="px-6 py-4">
                                <a
                                    href={`/fundraiser/${fundraiser.id}`}
                                    className="font-semibold text-lg inline-block text-white hover:text-purple-400 transition duration-500 ease-in-out"
                                >
                                    {fundraiser.title}
                                </a>
                                <p className="text-gray-400 text-sm">{fundraiser.description}</p>
                            </div>
                            <div className="px-6 py-4 flex flex-row items-center">
                                <span className="py-1 text-sm font-regular text-gray-300 mr-1 flex flex-row items-center">
                                    <svg height="13px" width="13px" viewBox="0 0 512 512" aria-label="Time posted">
                                        <path d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M277.333,256 c0,11.797-9.536,21.333-21.333,21.333h-85.333c-11.797,0-21.333-9.536-21.333-21.333s9.536-21.333,21.333-21.333h64v-128 c0-11.797,9.536-21.333,21.333-21.333s21.333,9.536,21.333,21.333V256z" />
                                    </svg>
                                    <span className="ml-1">{fundraiser.timeAgo}</span>
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination currentPage={1} setCurrentPage={null!} totalPages={10} />
            </section>
        </main>
    );
}
