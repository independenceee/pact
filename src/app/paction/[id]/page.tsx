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

                    <section className="mt-4">
                        <div className="overflow-x-auto bg-gray-800/80 dark:bg-gray-800/80 rounded shadow-lg hover:shadow-purple-500/10 border border-gray-700/50">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-900 dark:bg-gray-900 text-gray-300 dark:text-gray-300 uppercase text-sm leading-normal">
                                        <th className="py-4 px-6 text-base text-center">Tx Hash</th>
                                        <th className="py-4 px-6 text-base text-center">Wallet Address</th>
                                        <th className="py-4 px-6 text-base text-center">Amount</th>
                                        <th className="py-4 px-6 text-base text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300 dark:text-gray-300 text-sm">
                                    <tr className="border-b border-gray-700 dark:border-gray-700 hover:bg-gray-700/90 dark:hover:bg-gray-700/90">
                                        <td className="py-4 px-6 text-base text-center">5</td>
                                        <td className="py-4 px-6 text-base text-center">Mandan Pillai</td>
                                        <td className="py-4 px-6 text-base text-center">mandan@kerala.com</td>
                                        <td className="py-4 px-6 text-base text-center">Complete</td>
                                    </tr>
                                    <tr className="border-b border-gray-700 dark:border-gray-700 hover:bg-gray-700/90 dark:hover:bg-gray-700/90">
                                        <td className="py-4 px-6 text-base text-center">5</td>
                                        <td className="py-4 px-6 text-base text-center">Mandan Pillai</td>
                                        <td className="py-4 px-6 text-base text-center">mandan@kerala.com</td>
                                        <td className="py-4 px-6 text-base text-center">Complete</td>
                                    </tr>
                                    <tr className="border-b border-gray-700 dark:border-gray-700 hover:bg-gray-700/90 dark:hover:bg-gray-700/90">
                                        <td className="py-4 px-6 text-base text-center">5</td>
                                        <td className="py-4 px-6 text-base text-center">Mandan Pillai</td>
                                        <td className="py-4 px-6 text-base text-center">mandan@kerala.com</td>
                                        <td className="py-4 px-6 text-base text-center">Complete</td>
                                    </tr>
                                    <tr className="border-b border-gray-700 dark:border-gray-700 hover:bg-gray-700/90 dark:hover:bg-gray-700/90">
                                        <td className="py-4 px-6 text-base text-center">5</td>
                                        <td className="py-4 px-6 text-base text-center">Mandan Pillai</td>
                                        <td className="py-4 px-6 text-base text-center">mandan@kerala.com</td>
                                        <td className="py-4 px-6 text-base text-center">Complete</td>
                                    </tr>
                                    <tr className="border-b border-gray-700 dark:border-gray-700 hover:bg-gray-700/90 dark:hover:bg-gray-700/90">
                                        <td className="py-4 px-6 text-base text-center">5</td>
                                        <td className="py-4 px-6 text-base text-center">Mandan Pillai</td>
                                        <td className="py-4 px-6 text-base text-center">mandan@kerala.com</td>
                                        <td className="py-4 px-6 text-base text-center">Complete</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <Pagination currentPage={1} setCurrentPage={null!} totalPages={2} />
                    </section>
                </div>
            </div>
        </main>
    );
}
