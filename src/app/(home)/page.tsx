"use client";

import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import { features } from "~/constants/features.constant";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { faqs } from "~/constants/faqs.constant";
import Pagination from "~/components/pagination";
import Link from "next/link";
import { router } from "~/constants/router.constant";

export default function Page() {
    return (
        <main className="font-sans bg-gray-900 snap-y snap-mandatory">
            <section className="snap-start relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-900">
                <style jsx>{`
                    .hero-glow::before {
                        content: "";
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: radial-gradient(circle at center, rgba(139, 92, 246, 0.15), transparent 70%);
                        pointer-events: none;
                    }
                    .text-shadow-md {
                        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    }
                `}</style>

                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-1/4 left-10 w-72 h-72 bg-purple-500/15 rounded-full filter blur-3xl"
                        variants={{
                            animate: {
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.5, 0.3],
                                transition: { repeat: Infinity, duration: 5, ease: "easeInOut" },
                            },
                        }}
                        animate="animate"
                    ></motion.div>
                    <motion.div
                        className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/15 rounded-full filter blur-3xl"
                        variants={{
                            animate: {
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.5, 0.3],
                                transition: { repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 },
                            },
                        }}
                        animate="animate"
                    ></motion.div>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 py-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center">
                        <motion.div
                            className="lg:w-1/2"
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.2 },
                                },
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full px-4 py-1.5 mb-6"
                            >
                                <span className="text-xs font-medium text-purple-400 mr-2">New Feature</span>
                                <span className="text-xs text-gray-200">Hydra-Powered Transactions</span>
                                <svg
                                    className="h-4 w-4 text-gray-300 ml-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                <h1 className="text-4xl text-white md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight text-shadow-md">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                        Cardano Hydra Pact
                                    </span>{" "}
                                    for Scalable DeFi
                                </h1>
                            </motion.div>

                            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
                                <p className="text-lg text-gray-200 mb-8 max-w-lg leading-relaxed">
                                    Unlock fast, secure, and low-cost transactions on Cardano with Hydra’s layer-2
                                    scaling, empowering decentralized finance with unparalleled efficiency.
                                </p>
                            </motion.div>

                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                className="flex flex-row gap-4"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white ring-purple-400/20 hover:ring-purple-400/30   font-bold transition-all shadow-lg rounded-lg py-6 px-8">
                                        Join the Pact
                                        <svg
                                            className="ml-2 h-5 w-5 inline"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 5l7 7-7 7"
                                            />
                                        </svg>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="border border-purple-400 text-purple-200 hover:bg-purple-500/20 py-6 rounded-lg font-bold transition-all duration-300">
                                        Explore Hydra
                                        <svg
                                            className="ml-2 h-5 w-5 inline"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 7h10v10"
                                            />
                                        </svg>
                                    </Button>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                                className="mt-8 flex items-center space-x-6"
                            >
                                <div>
                                    <p className="text-2xl font-bold text-white">1M+</p>
                                    <p className="text-sm text-gray-300">Hydra Transactions</p>
                                </div>
                                <div className="h-12 w-px bg-purple-400/50"></div>
                                <div>
                                    <p className="text-2xl font-bold text-white">50K+</p>
                                    <p className="text-sm text-gray-300">Active Users</p>
                                </div>
                                <div className="h-12 w-px bg-purple-400/50"></div>
                                <div>
                                    <p className="text-2xl font-bold text-white">100+</p>
                                    <p className="text-sm text-gray-300">DeFi Protocols</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="lg:w-1/2 mt-12 lg:mt-0"
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="relative max-w-md mx-auto">
                                <motion.div
                                    variants={{
                                        animate: {
                                            y: [-20, 20],
                                            rotate: [0, 2, -2, 0],
                                            transition: {
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                duration: 3,
                                                ease: "easeInOut",
                                            },
                                        },
                                    }}
                                    animate="animate"
                                >
                                    <img
                                        src="https://explorer.hydra.family/hydra.svg"
                                        alt="DeFi transactions on Cardano"
                                        className="rounded-full shadow-2xl border border-purple-300/20 w-full"
                                    />
                                </motion.div>

                                <div className="absolute -right-20 -top-10 bg-blue-600/30 backdrop-blur-md rounded-lg p-4 border border-blue-400/40 shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-green-600/30 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-green-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-300">Cost Efficiency</p>
                                            <p className="text-lg font-bold text-green-400">99% Cost Reduction</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -left-10 top-8 bg-purple-600/30 backdrop-blur-md rounded-lg p-4 border border-purple-400/40 shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-purple-500/30 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-purple-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485a2 2 0 01-2.828 0l-2.829-2.829a2 2 0 010-2.828L7.657 9.343a2 2 0 013.343 0L11 7.343z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-300">Scalability</p>
                                            <p className="text-lg font-bold text-white">Layer-2 Ready</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -left-10 bottom-0 bg-blue-600/30 backdrop-blur-md rounded-lg p-4 border border-blue-400/40 shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-green-600/30 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-green-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-300">Transaction Speed</p>
                                            <p className="text-lg font-bold text-green-400">Instant Settlement</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -right-30 bottom-20 bg-purple-600/30 backdrop-blur-md rounded-lg p-4 border border-purple-400/40 shadow-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 bg-purple-500/30 rounded-full flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-purple-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 11c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2m-6 2c0-1.1.9-2 2-2s2 .9 2 2-2 4-2 4m-2-6c0-1.1-.9-2-2-2s-2 .9-2 2 2 4 2 4m8-10V3H6v2m12 0v2m0 10v6H6v-6"
                                                />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-300">Security</p>
                                            <p className="text-lg font-bold text-white">Quantum Resistant</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="max-w-screen-xl mx-auto p-5 sm:p-10 md:p-16 relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Why Hydra Pact?
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Hydra Pact brings unparalleled scalability and efficiency to Cardano, empowering developers and
                        users in the DeFi ecosystem.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 md:gap-10">
                    <div className="flex-1">
                        <a href="#">
                            <div
                                className="h-64 bg-cover bg-center rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                                style={{
                                    backgroundImage:
                                        "url(https://i.pinimg.com/1200x/bb/ac/a9/bbaca9900bbf88c989becf458777616f.jpg)",
                                }}
                                title="Featured article"
                            ></div>
                        </a>
                        <div className="mt-4 bg-gray-800 rounded-lg p-6 flex flex-col justify-between leading-normal">
                            <div>
                                <a
                                    href="#"
                                    className="text-xs text-purple-400 uppercase font-medium mb-2 flex items-center hover:text-blue-400 transition duration-300"
                                >
                                    Technology
                                </a>
                                <a
                                    href="#"
                                    className="text-white font-bold text-xl mb-3 hover:text-purple-400 transition duration-300"
                                >
                                    The Future of Blockchain in 2025
                                </a>
                                <p className="text-gray-300 text-sm mb-4">
                                    Explore how blockchain technology is revolutionizing industries with secure,
                                    decentralized solutions.
                                </p>
                                <div className="w-full bg-gray-700 rounded-full h-2.5">
                                    <div
                                        className="bg-gradient-to-r from-purple-400 to-blue-400 h-2.5 rounded-full transition-all duration-300"
                                        style={{ width: "75%" }}
                                    ></div>
                                </div>
                                <p className="text-gray-400 text-xs mt-2">Funded: 75%</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <div>
                            {[
                                {
                                    date: "Sep 28, 2025",
                                    title: "AI-Powered Crypto Trading Bots",
                                    image: "https://i.pinimg.com/736x/6f/b7/bb/6fb7bbca52f521c7eb195f2465f1e711.jpg",
                                    fundedPercentage: 60,
                                },
                                {
                                    date: "Sep 20, 2025",
                                    title: "DeFi: The Next Financial Revolution",
                                    image: "https://i.pinimg.com/736x/6f/b7/bb/6fb7bbca52f521c7eb195f2465f1e711.jpg",
                                    fundedPercentage: 85,
                                },
                                {
                                    date: "Sep 15, 2025",
                                    title: "NFTs and Their Impact on Digital Art",
                                    image: "https://i.pinimg.com/736x/6f/b7/bb/6fb7bbca52f521c7eb195f2465f1e711.jpg",
                                    fundedPercentage: 45,
                                },
                                {
                                    date: "Sep 10, 2025",
                                    title: "Crypto Regulations: What to Expect",
                                    image: "https://i.pinimg.com/736x/6f/b7/bb/6fb7bbca52f521c7eb195f2465f1e711.jpg",
                                    fundedPercentage: 90,
                                },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start mb-4 pb-4 border-b border-gray-700/50">
                                    <a href="#" className="inline-block mr-4">
                                        <div
                                            className="w-16 h-16 bg-cover bg-center rounded-md"
                                            style={{
                                                backgroundImage: `url(${item.image})`,
                                            }}
                                        ></div>
                                    </a>
                                    <div className="text-sm flex-1">
                                        <p className="text-gray-400 text-xs">{item.date}</p>
                                        <a
                                            href="#"
                                            className="text-white font-medium hover:text-purple-400 transition duration-300"
                                        >
                                            {item.title}
                                        </a>
                                        {/* Thanh tiến trình cho bài viết phụ */}
                                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                                            <div
                                                className="bg-gradient-to-r from-purple-400 to-blue-400 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${item.fundedPercentage}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-gray-400 text-xs mt-1">Funded: {item.fundedPercentage}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Pagination currentPage={1} setCurrentPage={null!} totalPages={3} />
                    </div>
                </div>
            </section>

            <section className="snap-start py-24 min-h-screen bg-gray-900">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            Hydra Pact Features
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Discover the cutting-edge tools and capabilities of Hydra Pact, designed to empower DeFi on
                            Cardano.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-6 hover:bg-gray-700/90 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group transform hover:-translate-y-2"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-purple-600/10 rounded-lg w-10 h-10 flex items-center justify-center text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-600/20 transition-all duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mb-16 text-left bg-gray-900">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                        Discover Hydra Pact
                    </h2>
                    <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Learn how Hydra Pact is transforming Cardano with scalable, secure, and cost-effective DeFi
                        solutions.
                    </p>
                </div>
                <aside className="mx-auto my-0 flex w-full max-w-[1200px] flex-col gap-2 px-4">
                    <div className="flex w-full gap-7 max-sm:flex-col">
                        {/* Video */}
                        <div className="relative aspect-video w-[60%] rounded-3xl overflow-hidden shadow-lg max-sm:w-full">
                            <div className="absolute left-8 top-8 h-full w-full rounded-3xl bg-gray-800 shadow-xl"></div>
                            <iframe
                                className="absolute inset-0 z-10 block h-full w-full rounded-xl"
                                src="https://www.youtube.com/embed/Hf8YVPpIxPI"
                                title="Cardano Hydra Pact: Scaling DeFi with Layer-2 Solutions"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            ></iframe>
                        </div>

                        {/* Nội dung */}
                        <div className="z-10 flex w-[40%] flex-col items-start gap-4 max-md:gap-3 max-sm:w-full">
                            <h2 className="text-left text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                                Cardano Hydra Pact
                            </h2>
                            <p className="mb-1 text-lg md:text-xl font-normal text-gray-200">
                                Unlock scalable DeFi with Hydra, Cardano layer-2 solution for fast, low-cost
                                transactions.
                            </p>
                            <span className="text-left leading-relaxed text-gray-300 max-md:text-base">
                                Hydra Pact empowers developers and users with near-instant settlements, 99% cost
                                reduction, and quantum-resistant security for the future of decentralized finance.
                            </span>
                            <span className="text-left leading-relaxed text-gray-300 max-md:text-base">
                                Hydra Pact empowers developers and users with near-instant settlements, 99% cost
                                reduction, and quantum-resistant security for the future of decentralized finance.
                            </span>
                            <Link href={router.dashboard} target="_blank">
                                <button className="inline-flex items-center justify-center whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-400 bg-gradient-to-r from-purple-400 to-blue-400 px-8 py-3 font-semibold text-white rounded-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/50 hover:scale-105">
                                    Join the Pact
                                    <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </button>
                            </Link>
                        </div>
                    </div>
                </aside>
            </section>

            <section className="snap-start py-24 min-h-screen bg-gray-900">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Got questions about Hydra Pact? Explore our answers or reach out to our community for more
                            details.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((item, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-white/5 backdrop-blur-sm border border-purple-300/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-purple-400/50"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <AccordionTrigger className="px-6 py-4 text-white hover:text-purple-400 hover:no-underline flex items-center">
                                        <svg
                                            className="w-5 h-5 mr-2 text-purple-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M8 9l4 4 4-4"
                                            />
                                        </svg>
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 text-gray-300 leading-relaxed">
                                        {item.answer}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </section>
        </main>
    );
}
