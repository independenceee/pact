"use client";

import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import { features } from "~/constants/features.constant";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "~/components/ui/accordion";
import { faqs } from "~/constants/faqs.constant";

export default function Page() {
    return (
        <main>
            <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br hero-glow from-gray-900 via-indigo-900 to-purple-900 hero-glow">
                <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                        className="absolute top-1/4 left-10 w-72 h-72 bg-purple-500/20 rounded-full filter blur-3xl"
                        variants={{
                            animate: {
                                scale: [1, 1.2, 1],
                                opacity: [0.2, 0.4, 0.2],
                                transition: {
                                    repeat: Infinity,
                                    duration: 4,
                                    ease: "easeInOut",
                                },
                            },
                        }}
                        animate="animate"
                    ></motion.div>
                    <motion.div
                        className="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"
                        variants={{
                            animate: {
                                scale: [1, 1.2, 1],
                                opacity: [0.2, 0.4, 0.2],
                                transition: {
                                    repeat: Infinity,
                                    duration: 4,
                                    ease: "easeInOut",
                                },
                            },
                        }}
                        animate="animate"
                        style={{ animationDelay: "1s" }}
                    ></motion.div>
                </div>

                <div className="max-w-[1200px] mx-auto px-4 py-20 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center">
                        <motion.div
                            className="lg:w-1/2"
                            variants={{
                                hidden: { opacity: 0, x: -100 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full px-4 py-1.5 mb-6">
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
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                                    Cardano Hydra Pact
                                </span>{" "}
                                for Scalable DeFi
                            </h1>
                            <p className="text-lg text-gray-200 mb-8 max-w-lg">
                                Unlock fast, secure, and low-cost transactions on Cardano with Hydra’s layer-2 scaling,
                                empowering decentralized finance with unparalleled efficiency.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ring-purple-400/20 hover:ring-purple-400/30 transition-all shadow-md rounded-lg py-6 px-8">
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
                                    <Button className="border border-purple-400 text-purple-200 hover:bg-purple-500/10 py-6 rounded-lg font-semibold transition-all duration-300">
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
                            </div>
                            <div className="mt-8 flex items-center space-x-6">
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
                            </div>
                        </motion.div>

                        <motion.div
                            className="lg:w-1/2 mt-12 lg:mt-0"
                            variants={{
                                hidden: { opacity: 0, x: 100 },
                                visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } },
                            }}
                            initial="hidden"
                            animate="visible"
                        >
                            <div className="grid grid-cols-1 gap-6 max-w-md mx-auto relative">
                                <motion.div
                                    variants={{
                                        animate: {
                                            y: [-10, 10],
                                            transition: {
                                                repeat: Infinity,
                                                repeatType: "reverse",
                                                duration: 2,
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

                                {/* Badge 1: Efficiency Gain (Top-Right) */}
                                
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className="py-24 min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 hero-glow">
                <div className="max-w-[1200px] mx-auto px-4 ">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                            Powerful Features
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            CryptoFlow gives you the edge with advanced tools designed for both beginners and
                            professional traders.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm border border-purple-300/20 rounded-xl p-6 hover:bg-purple-500/10 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 group animate-on-scroll"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="bg-purple-500/20 rounded-lg w-12 h-12 flex items-center justify-center mb-5 text-purple-400 group-hover:bg-purple-500/30 transition-colors duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-300">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-300 max-w-2xl mx-auto">
                            Got questions about CryptoFlow? We are got answers. If you dont see what you are looking
                            for, reach out to our support team.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        <Accordion type="single" collapsible className="space-y-4">
                            {faqs.map((item, index) => (
                                <AccordionItem
                                    key={index}
                                    value={`item-${index}`}
                                    className="bg-white/5 backdrop-blur-sm border border-purple-300/20 rounded-xl overflow-hidden animate-on-scroll"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    <AccordionTrigger className="px-6 py-4 text-white hover:text-purple-400 hover:no-underline">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent className="px-6 pb-4 text-gray-300">
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
