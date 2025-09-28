import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import Link from "next/link";
import { router } from "~/constants/router.constant";

export const baseOptions: BaseLayoutProps = {
    nav: {
        title: (
            <div className="flex flex-col text-center items-start justify-center gap-3 w-full">
                <Link href={router.home} className="flex items-center text-center">
                    <h1 className="text-3xl font-bold text-white">
                        Hydra
                        <span className="bg-clip-text text-transparent bg-purple-400 font-bold">Pact</span>
                    </h1>
                </Link>
            </div>
        ),
    },
    githubUrl: "https://github.com/cardano2vn",
};
