"use client";

import Image, { StaticImageData } from "next/image";
import { cn } from "~/libs/utils";

export default function Network({
    image,
    name,
    isActive,
    setNetwork,
}: {
    image: StaticImageData;
    name: string;
    isActive: boolean;
    setNetwork: React.Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <button
            onClick={() => {
                if (isActive) return;
                setNetwork(name.toLowerCase());
            }}
            className={cn(
                "flex items-center justify-center flex-col w-[52px] h-[52px] text-[10px] cursor-pointer rounded-[5px] p-3 transition-colors",
                {
                    "bg-purple-600/80 text-white": isActive,
                    "bg-gray-900 text-gray-200 hover:bg-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700":
                        !isActive,
                },
            )}
        >
            <Image src={image} alt="Network" className="w-[32px] h-[32px] rounded-full" />
            <span>{name}</span>
        </button>
    );
}
