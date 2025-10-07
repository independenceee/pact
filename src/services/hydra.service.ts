"use server";

import { MeshWallet } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { isNil } from "lodash";
import { HeadStatus } from "~/constants/common.constant";
import {
    APP_NETWORK_ID,
    HYDRA_HTTP_URL,
    HYDRA_HTTP_URL_SUB,
    HYDRA_WS_URL,
    HYDRA_WS_URL_SUB,
} from "~/constants/enviroments.constant";
import { blockfrostProvider } from "~/libs/cardano";
import { HydraTxBuilder } from "~/txbuilders/hydra.txbuilder";

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

/**
 * @description Commit UTXOs into a Hydra Head.
 *
 * @param {Object} params
 * @param {string} params.walletAddress - Wallet address committing UTXOs.
 * @param {Object} [params.input] - Optional UTXO input { txHash, outputIndex }.
 * @param {boolean} params.isCreator - Whether this wallet is Head creator.
 * @param {string} [params.status] - Current Hydra Head status.
 *
 * @returns {Promise<{success: boolean; unsignedTx: unknown; message: string}>}
 */
export const commit = async function ({
    walletAddress,
    input,
    isCreator = false,
    status,
}: {
    walletAddress: string;
    input?: { txHash: string; outputIndex: number };
    isCreator: boolean;
    status?: string;
}) {
    try {
        if (isNil(walletAddress)) {
            throw new Error("walletAddress has been required.");
        }

        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "address",
                address: walletAddress,
            },
        });

        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({
            meshWallet: meshWallet,
            hydraProvider: hydraProvider,
        });

        await hydraTxBuilder.connect();
        await hydraTxBuilder.initialize();

        console.log(status);

        switch (status) {
            case HeadStatus.IDLE:
                await hydraTxBuilder.init();
                break;

            default:
                break;
        }

        return await hydraTxBuilder.commit({ input: input });
    } catch (error) {
        throw Error(String(error));
    }
};
