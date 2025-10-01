"use client";

import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { router } from "~/constants/router.constant";

const Footer = () => {
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    if (pathname.startsWith(router.documentation)) {
        return null;
    }

    return (
        <footer className="bg-gray-900 pt-16 pb-8">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-8">
                    <div className="lg:col-span-2">
                        <Link href={router.home} className="flex items-center mb-2">
                            <h1 className="text-3xl font-bold text-white">
                                Hydra
                                <span className="bg-clip-text text-transparent bg-purple-400 font-bold">Pact</span>
                            </h1>
                        </Link>
                        <p className="text-gray-300 mb-6 max-w-xs">
                            Empowering the future of finance with secure, innovative, and decentralized cryptocurrency
                            solutions.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://facebook.com/hydrapact"
                                className="text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </a>
                            <a
                                href="https://twitter.com/hydrapact"
                                className="text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a
                                href="https://instagram.com/hydrapact"
                                className="text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </a>
                            <a
                                href="https://linkedin.com/company/hydrapact"
                                className="text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                            <a
                                href="https://github.com/hydrapact"
                                className="text-gray-300 hover:text-purple-400 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Products</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Exchange
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Wallet
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://x.ai/api"
                                    className="text-gray-300 hover:text-purple-400 transition-colors"
                                >
                                    API
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Institutional Services
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    DeFi Platform
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Resources</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Tutorials
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Market Data
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Help Center
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-medium mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Careers
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Press
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Legal & Privacy
                                </a>
                            </li>
                            <li>
                                <a href="#!" className="text-gray-300 hover:text-purple-400 transition-colors">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-purple-400/30 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-300 text-sm mb-4 md:mb-0">
                            &copy; {currentYear} Hydra Pact. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#!" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
                                Terms of Service
                            </a>
                            <a href="#!" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#!" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
                                Cookie Policy
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
