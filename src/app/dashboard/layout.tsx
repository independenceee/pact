import { PropsWithChildren } from "react";
import Sidebar from "~/components/sidebar";

export default function Layout({ children }: PropsWithChildren) {
    return (
        <main className="font-sans bg-gradient-to-br from-gray-900 to-gray-800 snap-y snap-mandatory min-h-screen text-gray-100 pt-16">
            <section className="max-w-screen-xl mx-auto p-5 sm:p-8 md:p-12 lg:p-16 flex">
                <Sidebar />
                <aside className="flex-1 md:ml-8">
                    <main >
                        {children}
                    </main>
                </aside>
            </section>
        </main>
    );
}
