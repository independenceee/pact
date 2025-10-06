import Pagination from "~/components/pagination";
import Status from "~/components/status";

export default function Page() {
    return (
        <main className="font-sans bg-gray-900 snap-y snap-mandatory">
            <div className="bg-gray-900 dark:bg-gray-900 py-8">
                <div className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 flex flex-col gap-4">
                    <Status />
                    <div className="flex flex-col md:flex-row -mx-4">
                        <div className="md:flex-1 px-4">
                            <div className="h-[460px] rounded-lg bg-gray-800/80 dark:bg-gray-800/80 mb-4">
                                <img
                                    className="w-full h-full object-cover rounded"
                                    src="https://cdn.pixabay.com/photo/2020/05/22/17/53/mockup-5206355_960_720.jpg"
                                    alt="Product Image"
                                />
                            </div>
                        </div>
                        <div className="md:flex-1 px-4">
                            <h2 className="text-2xl font-bold text-white dark:text-white mb-2 hover:text-purple-400">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo.
                            </h2>

                            <div className="mb-4">
                                <div className="flex mt-2  flex-col">
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-gradient-to-r from-purple-400 to-blue-400 h-3 rounded-full transition-all duration-300"
                                            style={{ width: "75%" }}
                                        ></div>
                                    </div>
                                    <p className="text-gray-400 text-xs mt-2">
                                        Funded: 75% --- Paticipants: 2 --- Required: 10 ADA / Paticipant
                                    </p>
                                </div>
                            </div>
                            <div className="mb-4 flex flex-col gap-2">
                                <span className="font-bold text-gray-300 dark:text-gray-300">Destination:</span>
                                <div className="flex flex-1 items-center mb-4  shadow-lg hover:shadow-purple-500/10">
                                    <div className="relative">
                                        <img
                                            className="h-16 w-16 rounded-full object-cover ring-2 ring-gray-700/50 dark:ring-gray-700/50"
                                            src="https://randomuser.me/api/portraits/women/87.jpg"
                                            alt="Avatar"
                                        />
                                        <div className="absolute inset-0 rounded-full shadow-inner"></div>
                                    </div>
                                    <div className="ml-4">
                                        <h2 className="font-bold text-white dark:text-white text-lg hover:text-purple-400">
                                            Jane Doe
                                        </h2>
                                        <p className="text-gray-300 dark:text-gray-300">Software Engineer</p>
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
                                <span className="font-bold text-gray-300 dark:text-gray-300">Product Description:</span>
                                <p className="text-gray-300 dark:text-gray-300 text-sm mt-2">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer
                                    euismod libero id mauris malesuada tincidunt. Vivamus commodo nulla ut lorem rhoncus
                                    aliquet. Duis dapibus augue vel ipsum pretium, et venenatis sem blandit. Quisque ut
                                    erat vitae nisi ultrices placerat non eget velit. Integer ornare mi sed ipsum
                                    lacinia, non sagittis mauris blandit. Morbi fermentum libero vel nisl suscipit, nec
                                    tincidunt mi consectetur.
                                </p>
                            </div>
                        </div>
                    </div>

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
                                    {[
                                        {
                                            hash: "tx_7f9e8d...",
                                            wallet: "addr1q8x5...",
                                            amount: "15 ADA",
                                            status: "Confirmed",
                                        },
                                        {
                                            hash: "tx_6a5b4c...",
                                            wallet: "addr1q9y6...",
                                            amount: "10 ADA",
                                            status: "Pending",
                                        },
                                        {
                                            hash: "tx_3d2e1f...",
                                            wallet: "addr1q7z4...",
                                            amount: "20 ADA",
                                            status: "Confirmed",
                                        },
                                    ].map((tx, i) => (
                                        <tr
                                            key={i}
                                            className="border-b border-gray-700/50 hover:bg-purple-500/5 transition-colors"
                                        >
                                            <td className="py-4 px-6 text-gray-300 font-mono">{tx.hash}</td>
                                            <td className="py-4 px-6 text-gray-300 font-mono">{tx.wallet}</td>
                                            <td className="py-4 px-6 text-right text-gray-300">{tx.amount}</td>
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
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-center mt-6">
                            <Pagination currentPage={1} setCurrentPage={null!} totalPages={2} />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    );
}
