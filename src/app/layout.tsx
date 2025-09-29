import "./globals.css";
import { auth } from "~/libs/auth";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Layout from "~/components/layout";
import { PropsWithChildren } from "react";
import Provider from "~/providers";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Hydra Pact",
    description:
        "A decentralized group funding platform powered by Cardano's Hydra Layer 2 for secure, trustless, and low-cost multi-party contributions",
};

export default async function RootLayout({ children }: Readonly<PropsWithChildren>) {
    const session = await auth();
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <Provider session={session}>
                    <Layout>{children}</Layout>
                </Provider>
            </body>
        </html>
    );
}
