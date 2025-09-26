"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                `fixed w-full z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-gradient-to-r from-gray-900 via-indigo-900/90 to-purple-900/90 backdrop-blur-md py-3 shadow-lg"
                        : "bg-transparent py-6"
                }`,
            )}
        >
            <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold text-white">
                        Hydra
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500 font-bold">
                            Pact
                        </span>
                    </h1>
                </div>

                <ul className="hidden lg:flex items-center space-x-8">
                    <li>
                        <a href="#features" className="text-gray-300 hover:text-purple-400 transition-colors">
                            Features
                        </a>
                    </li>
                    <li>
                        <a href="#how-it-works" className="text-gray-300 hover:text-purple-400 transition-colors">
                            How it works
                        </a>
                    </li>
                    <li>
                        <a href="#testimonials" className="text-gray-300 hover:text-purple-400 transition-colors">
                            Testimonials
                        </a>
                    </li>
                    <li>
                        <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition-colors">
                            Pricing
                        </a>
                    </li>
                    <li>
                        <a href="#faq" className="text-gray-300 hover:text-purple-400 transition-colors">
                            FAQ
                        </a>
                    </li>
                </ul>

                <div className="hidden lg:flex items-center space-x-4">
                    <Link href="#!">
                        <Button
                            className={cn(
                                "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ring-purple-400/20 hover:ring-purple-400/30 transition-all shadow-md rounded-lg",
                            )}
                        >
                            Connect Wallet
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="lg:hidden text-white hover:text-purple-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden bg-gradient-to-b from-gray-900/95 to-indigo-900/95 backdrop-blur-lg absolute top-full left-0 w-full py-4 shadow-lg border-b border-purple-400/30">
                    <div className="container mx-auto px-4">
                        <ul className="flex flex-col space-y-4">
                            <li>
                                <a
                                    href="#features"
                                    className="text-gray-200 hover:text-purple-400 transition-colors block py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Features
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#how-it-works"
                                    className="text-gray-200 hover:text-purple-400 transition-colors block py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    How it works
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#testimonials"
                                    className="text-gray-200 hover:text-purple-400 transition-colors block py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Testimonials
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pricing"
                                    className="text-gray-200 hover:text-purple-400 transition-colors block py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Pricing
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#faq"
                                    className="text-gray-200 hover:text-purple-400 transition-colors block py-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    FAQ
                                </a>
                            </li>
                            <li className="pt-4 flex flex-col space-y-3">
                                <Button
                                    variant="ghost"
                                    className="text-gray-200 hover:text-purple-400 hover:bg-purple-500/10 w-full justify-start"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Button>
                                <Link href="#!">
                                    <Button
                                        className={cn(
                                            "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white ring-purple-400/20 hover:ring-purple-400/30 transition-all shadow-md rounded-lg w-full",
                                        )}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        Buy Now
                                    </Button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
}
