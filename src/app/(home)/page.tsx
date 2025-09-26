"use client";

import { Button } from "~/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { features } from "~/constants/features.constant";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { faqs } from "~/constants/faqs.constant";

export default function Page() {
    return (
        <main className="font-sans bg-gray-900">
            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gray-900">
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

                {/* Background Animation Circles */}
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

                {/* Hero Content */}
                <div className="max-w-[1200px] mx-auto px-4 py-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center">
                        {/* Left Content */}
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
                                className="flex flex-col sm:flex-row gap-4"
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white ring-purple-400/20 hover:ring-purple-400/30 font-bold transition-all shadow-lg rounded-lg py-6 px-8">
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

                        {/* Right Content (Image + Badges) */}
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

                                {/* Badges Grid */}
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

                                {/* Badge 2: Scalability (Top-Left) */}
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

                                {/* Badge 3: Transaction Speed (Bottom-Left) */}
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

            {/* Features Section */}
            <section className="py-24 min-h-screen bg-gray-900">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            Powerful Features
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            CryptoFlow gives you the edge with advanced tools designed for both beginners and
                            professional traders.
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

             <section className="py-24 min-h-screen bg-gray-900">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Got questions about CryptoFlow? We’ve got answers. If you don’t see what you’re looking for,
                            reach out to our support team.
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
