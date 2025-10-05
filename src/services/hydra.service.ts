"use server";

import { HydraProvider } from "@meshsdk/hydra";
import { HYDRA_HTTP_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL, HYDRA_WS_URL_SUB } from "~/constants/enviroments";

export const disburse = async function ({}: {}) {};

/**
 * @description Get the current Hydra Head status for a wallet.
 *
 * @param {Object} params
 * @param {string} params.walletAddress - Wallet address.
 * @param {boolean} params.isCreator - Whether the caller is Head creator.
 *
 * @returns {Promise<string>} Head status (OPEN, CLOSED, IDLE, etc.)
 */
export const getStatus = async function ({ walletAddress, isCreator }: { walletAddress: string; isCreator: boolean }) {
    try {
        if (!walletAddress || typeof walletAddress !== "string" || walletAddress.trim() === "") {
            return "Invalid wallet address provided";
        }

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        await hydraProvider.connect();
        const status = await hydraProvider.get("head");

        return (status.tag as string).toUpperCase();
    } catch (error) {
        return "Idle";
    }
};
