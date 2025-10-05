"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebars } from "~/constants/sidebars.constant";

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="static max-md:hidden top-16 left-0 h-68 w-70 bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-2xl rounded transition-all duration-300 ease-in-out ">
            <nav className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-500/50 hover:[&::-webkit-scrollbar-thumb]:bg-gray-400">
                <ul className="space-y-2">
                    {sidebars.map((sidebar, index) => (
                        <li key={index}>
                            <Link
                                href={sidebar.href}
                                className={`flex items-center gap-3 py-3 px-4 text-sm font-semibold rounded-xl transition-all duration-200 group  max-md:justify-center ${
                                    pathname === sidebar.href
                                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                                        : "hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 text-gray-200 hover:text-white"
                                }`}
                            >
                                <sidebar.Icon
                                    className={`w-6 h-6 transition-transform duration-200 max-md:w-5 max-md:h-5 ${
                                        pathname === sidebar.href
                                            ? "text-white scale-110"
                                            : "text-gray-300 group-hover:text-white group-hover:scale-110"
                                    }`}
                                />
                                <span className="truncate max-md:hidden">{sidebar.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}
