"use server";

import prisma from "~/libs/prisma";
import { parseError } from "~/utils/error/parse-error";
import { isNil } from "lodash";
import { generateNonce } from "@meshsdk/core";

export const getNonce = async function (walletAddress: string) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("Wallet address is required");
        }

        if (!/^[a-z0-9_]+$/.test(walletAddress)) {
            throw new Error("Invalid address");
        }

        const nonce = generateNonce("signin to cip68 nft");
        const walletNonce = await prisma.walletNonce.upsert({
            where: {
                address: walletAddress,
            },
            create: {
                address: walletAddress,
                nonce: nonce,
            },
            update: {
                nonce: nonce,
            },
        });
        if (!walletNonce) {
            throw new Error("Cannot get the nonce");
        }

        return {
            data: nonce,
            result: true,
            message: "Nonce generated successfully",
        };
    } catch (e) {
        return {
            data: null,
            result: false,
            message: parseError(e),
        };
    }
};
