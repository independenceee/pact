"use client";
import { PropsWithChildren, useState } from "react";

export default function Layout({ children }: PropsWithChildren) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <main className="font-sans bg-gradient-to-br from-gray-900 to-gray-800 snap-y snap-mandatory min-h-screen text-gray-100 pt-16">
            {/* Mobile Sidebar Toggle Button */}
            <button
                className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-gray-800/90 backdrop-blur-md text-white hover:bg-gray-700 transition-all duration-300"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
            >
                <svg
                    className={`w-6 h-6 transition-transform duration-300 ${isSidebarOpen ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    {isSidebarOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            <section className="max-w-screen-xl h-full mx-auto p-5 sm:p-8 md:p-12 lg:p-16 flex">
                {/* Sidebar */}
                <aside
                    className={`fixed top-16 left-0 h-[calc(100%-4rem)] w-64 bg-gradient-to-b from-gray-800/90 to-gray-900/90 backdrop-blur-lg text-white p-6 transition-transform duration-300 ease-in-out md:static md:w-1/4 md:h-auto md:top-0 shadow-2xl z-40 ${
                        isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
                    role="dialog"
                    aria-label="Sidebar"
                >
                    <div className="relative flex flex-col h-full max-h-full">
                        {/* Navigation */}
                        <nav className="h-full overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-700 [&::-webkit-scrollbar-thumb]:bg-gray-500">
                            <ul className="space-y-2 px-2">
                                {[
                                    {
                                        href: "#dashboard",
                                        icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
                                        label: "Dashboard",
                                    },
                                    {
                                        id: "users",
                                        icon: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7 14v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
                                        label: "Users",
                                    },
                                    {
                                        id: "account",
                                        icon: "M18 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm3.7 1.4-.9-.3M15.2 13.9l-.9-.3m1.4 4.8.3-.9m2.5-6.5.3-.9m.5 6.5-.4-1m-2.8-6.4-.4-1m-2.5 4.3 1-.4m6.4-2.8 1-.4M10 15H6a4 4 0 0 0-4 4v2m8-12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
                                        label: "Account",
                                    },
                                    {
                                        id: "projects",
                                        icon: "M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2zM3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8M15 2v5h5",
                                        label: "Projects",
                                    },
                                    {
                                        href: "#calendar",
                                        icon: "M3 4h18v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4m13-2v4M8 2v4M3 10h18m-13 4h.01m4 0h.01m4 0h.01m-8 4h.01m4 0h.01m4 0h.01",
                                        label: "Calendar",
                                        badge: "New",
                                    },
                                    {
                                        href: "#documentation",
                                        icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zm20 0h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z",
                                        label: "Documentation",
                                    },
                                ].map((item) => (
                                    <li key={item.href || item.id}>
                                        <a
                                            href={item.href}
                                            className="flex items-center gap-x-3.5 py-2 px-3 text-sm font-medium rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 group"
                                            onClick={() => setIsSidebarOpen(false)}
                                        >
                                            <svg
                                                className="w-5 h-5 group-hover:animate-pulse"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d={item.icon}
                                                />
                                            </svg>
                                            <span>{item.label}</span>
                                            {item.badge && (
                                                <span className="ms-auto py-0.5 px-1.5 inline-flex items-center gap-x-1.5 text-xs bg-blue-600 text-white rounded-full">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 md:ml-8">
                    <div className="snap-always bg-gray-800/90 backdrop-blur-md rounded p-8 shadow-2xl animate-fade-in">
                        {children}
                    </div>
                </div>
            </section>

            {/* Custom CSS for animations and smooth scrolling */}
            <style jsx global>{`
                html {
                    scroll-behavior: smooth;
                }
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }
            `}</style>
        </main>
    );
}

// Accordion Item Component
function AccordionItem({
    id,
    icon,
    label,
    subItems,
    onClick,
}: {
    id: string;
    icon: string;
    label: string;
    subItems: { id: string; label: string; subLinks: string[] }[];
    onClick: () => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="hs-accordion" id={id}>
            <button
                className="hs-accordion-toggle flex items-center gap-x-3.5 py-2 px-3 w-full text-sm font-medium rounded-lg hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 hover:text-white transition-all duration-300 group"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={`${id}-collapse`}
            >
                <svg
                    className="w-5 h-5 group-hover:animate-pulse"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon} />
                </svg>
                <span>{label}</span>
                <svg
                    className={`ms-auto w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 9l6 6 6-6" />
                </svg>
            </button>
            <div
                id={`${id}-collapse`}
                className={`hs-accordion-content overflow-hidden transition-[height] duration-300 ${
                    isOpen ? "block" : "hidden"
                }`}
                role="region"
                aria-labelledby={id}
            >
                <ul className="pt-1 ps-7 space-y-1">
                    {subItems.map((subItem) => (
                        <li key={subItem.id} className="hs-accordion" id={`${id}-${subItem.id}`}>
                            <button
                                className="hs-accordion-toggle flex items-center gap-x-3.5 py-2 px-3 w-full text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all duration-300 group"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-expanded={isOpen}
                                aria-controls={`${id}-${subItem.id}-collapse`}
                            >
                                <span>{subItem.label}</span>
                                <svg
                                    className={`ms-auto w-4 h-4 transition-transform duration-300 ${
                                        isOpen ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 9l6 6 6-6"
                                    />
                                </svg>
                            </button>
                            <div
                                id={`${id}-${subItem.id}-collapse`}
                                className={`hs-accordion-content overflow-hidden transition-[height] duration-300 ${
                                    isOpen ? "block" : "hidden"
                                }`}
                                role="region"
                                aria-labelledby={`${id}-${subItem.id}`}
                            >
                                <ul className="pt-1 ps-2 space-y-1">
                                    {subItem.subLinks.map((link, index) => (
                                        <li key={index}>
                                            <a
                                                href="#"
                                                className="flex items-center gap-x-3.5 py-2 px-3 text-sm font-medium rounded-lg hover:bg-gray-700 hover:text-blue-300 transition-all duration-300"
                                                onClick={onClick}
                                            >
                                                {link}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
