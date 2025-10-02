"use client";
import { PropsWithChildren, useState } from "react";

export default function Layout({ children }: PropsWithChildren) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <main className="font-sans bg-gray-900 snap-y snap-mandatory min-h-screen text-gray-100 pt-16">
            <section className="max-w-screen-xl h-full mx-auto p-5 sm:p-10 md:p-16 flex">
                {/* Sidebar */}
                <aside className="-translate-x-full  md:translate-x-0 fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 transition-transform duration-300 ease-in-out md:w-1/4 md:static md:h-auto md:top-0 z-50 shadow-lg">
                    <nav>
                        <ul className="space-y-4">
                            <li>
                                <a
                                    href="#home"
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 hover:text-blue-300 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                        ></path>
                                    </svg>
                                    <span>Home</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#about"
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 hover:text-blue-300 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        ></path>
                                    </svg>
                                    <span>About</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#services"
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 hover:text-blue-300 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        ></path>
                                    </svg>
                                    <span>Services</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#contact"
                                    className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-700 hover:text-blue-300 transition-colors duration-200"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        ></path>
                                    </svg>
                                    <span>Contact</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 md:ml-6">
                    <button
                        className="md:hidden text-white p-3 bg-blue-600 rounded-lg mb-4 hover:bg-blue-700 transition-colors duration-200 shadow-md"
                        onClick={toggleSidebar}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>
                    <div className="snap-always bg-gray-800 rounded p-6 shadow-xl">{children}</div>
                </div>
            </section>
        </main>
    );
}
