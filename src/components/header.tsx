"use client";

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";
import { navbars } from "~/constants/navbar.constant";

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
                `fixed w-full z-50 max-lg:bg-gray-900/95 max-lg:backdrop-blur-lg transition-all duration-300 ${
                    isScrolled
                        ? "bg-gray-900/95 backdrop-blur-lg py-5 shadow-lg border-b border-purple-400/20"
                        : "bg-transparent py-7"
                }`,
            )}
        >
            <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-white">
                        Hydra
                        <span className="bg-clip-text text-transparent bg-purple-400 font-bold">Pact</span>
                    </h1>
                </div>

                <ul className="hidden lg:flex items-center space-x-10">
                    {navbars.map(function (navbar) {
                        return (
                            <li key={navbar.id}>
                                <Link
                                    href={navbar.router}
                                    className="text-lg text-gray-200 hover:text-purple-400 transition-colors"
                                >
                                    {navbar.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                <div className="hidden lg:flex items-center space-x-4">
                    <Link href="#!">
                        <Button
                            className={cn(
                                "bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 text-shadow-lg ring-purple-400/20 hover:ring-purple-400/30 transition-all shadow-md rounded-lg",
                            )}
                        >
                            Connect Wallet
                        </Button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <Button
                    className="lg:hidden text-white hover:text-purple-400 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </Button>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
                <div className="lg:hidden h-screen bg-gray-900/95 backdrop-blur-lg absolute top-full left-0 w-full py-6 shadow-lg border-b border-purple-400/30">
                    <div className="container mx-auto px-6">
                        <ul className="flex flex-col space-y-4">
                            {navbars.map(function (navbar) {
                                return (
                                    <li key={navbar.id}>
                                        <Link
                                            href={navbar.router}
                                            className="text-lg text-gray-200 hover:text-purple-400 transition-colors block py-3"
                                        >
                                            {navbar.name}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
}
