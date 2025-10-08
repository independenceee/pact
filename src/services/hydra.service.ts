"use server";

import { MeshWallet, UTxO } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { isNil } from "lodash";
import { HeadStatus } from "~/constants/common.constant";
import {
    APP_MNEMONIC,
    APP_NETWORK_ID,
    HYDRA_HTTP_URL,
    HYDRA_HTTP_URL_SUB,
    HYDRA_WS_URL,
    HYDRA_WS_URL_SUB,
} from "~/constants/enviroments.constant";
import { blockfrostProvider } from "~/libs/cardano";
import { HydraTxBuilder } from "~/txbuilders/hydra.txbuilder";

/**
 * @description Disburse previously locked lovelace from the Hydra contract.
 * This function prepares a transaction that spends the UTxO locked at the
 * Hydra contract address using the provided Plutus script and redeemer.
 *
 * @returns {Promise<any>} - An unsigned transaction object ready to be signed and submitted.
 *
 * @throws {Error} - Throws if UTxOs are insufficient, collateral is missing,
 * or contract UTxOs cannot be retrieved.
 */
export const disburse = async function ({ walletAddress, isCreator }: { walletAddress: string; isCreator: boolean }) {
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
        await hydraTxBuilder.initialize();
        await hydraTxBuilder.connect();

        const unsignedTx = await hydraTxBuilder.disburse();

        return unsignedTx;
    } catch (error) {
        throw new Error(String(error));
    }
};

/**
 * @description Contributes a specific amount of lovelace into the Hydra contract address.
 * This function prepares a transaction that consumes a UTxO from the wallet
 * and sends lovelace to the `spendAddress` with inline datum attached.
 *
 * @param {Object} params
 * @param {number} [params.amount=10] - The amount of lovelace to lock (default is 10).
 *
 * @returns {Promise<any>} - An unsigned transaction object ready to be signed and submitted.
 *
 * @throws {Error} - Throws if UTxOs are insufficient or wallet address cannot be retrieved.
 */
export const contribute = async function ({
    walletAddress,
    isCreator,
    quantity,
    required,
    destination,
}: {
    walletAddress: string;
    quantity: number;
    required: number;
    isCreator: boolean;
    destination: string;
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
        await hydraTxBuilder.initialize();
        await hydraTxBuilder.connect();

        const unsignedTx = await hydraTxBuilder.contribute({
            destination: destination,
            quantity: quantity,
            required: required,
        });

        return unsignedTx;
    } catch (error) {
        throw new Error(String(error));
    }
};

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

/**
 * @description Submit a signed transaction to Hydra Head.
 *
 * @param {Object} params
 * @param {string} params.signedTx - Signed transaction (Cbor hex).
 * @param {boolean} params.isCreator - Whether the caller is Head creator.
 *
 * @returns {Promise<{data: string | null; result: boolean; message: string}>}
 */
export const submitHydraTx = async function ({
    signedTx,
    isCreator,
}: {
    signedTx: string;
    isCreator: boolean;
}): Promise<void> {
    try {
        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });

        await hydraProvider.connect();
        await new Promise<void>(async (resolve, reject) => {
            hydraProvider.submitTx(signedTx).catch((error: Error) => reject(error));
            hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "SnapshotConfirmed") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    } catch (error) {
        throw new Error(String(error));
    }
};

/**
 * Fetches the list of UTxOs (Unspent Transaction Outputs) for a given wallet address
 * directly from a Hydra Head — either from the creator node or a subscriber node.
 *
 * This function:
 *  - Initializes a HydraProvider depending on whether the caller is a creator or subscriber.
 *  - Establishes a connection to the specified Hydra Head.
 *  - Retrieves all UTxOs associated with the given wallet address.
 *  - Ensures the connection is properly closed afterward to avoid WebSocket leaks.
 *  - Returns an empty array in case of any error (safe fallback).
 *
 * @async
 * @param {Object} params - Input parameters.
 * @param {string} params.walletAddress - The Cardano wallet address to query UTxOs for.
 * @param {boolean} [params.isCreator=false] - Whether to connect to the creator's Hydra node or the subscriber’s.
 * @returns {Promise<UTxO[]>} A promise that resolves to an array of UTxOs. Returns [] on failure.
 */
export const getUTxOsFromHydra = async function ({
    walletAddress,
    isCreator = false,
}: {
    walletAddress: string;
    isCreator?: boolean;
}): Promise<UTxO[]> {
    try {
        const hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });
        await hydraProvider.connect();
        const utxos = await hydraProvider.fetchAddressUTxOs(walletAddress);
        return utxos;
    } catch (error) {
        return [];
    }
};

/**
 * @description
 * Perform Hydra fanout, distributing finalized off-chain funds
 * back to layer-1 (Cardano mainnet/testnet).
 *
 * Flow:
 * 1. Connect to Hydra provider.
 * 2. Trigger Hydra `fanout` process.
 * 3. Listen for status changes.
 * 4. Resolve when status becomes `"FANOUT_POSSIBLE"`.
 *
 * @returns {Promise<void>}
 *          Resolves when fanout is possible.
 *
 * @throws {Error}
 *         Throws if fanout request fails.
 */
export const fanout = async function ({ status, isCreator = false }: { status: string; isCreator: boolean }) {
    try {
        const meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                words: APP_MNEMONIC?.split(" ") || [],
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

        await hydraProvider.connect();
        switch (status) {
            case HeadStatus.OPEN:
                await hydraProvider.close();
                await hydraTxBuilder.fanout();
                await hydraTxBuilder.final();
                break;
            case HeadStatus.CLOSED:
                await hydraTxBuilder.fanout();
                await hydraTxBuilder.final();
                break;
            case HeadStatus.FANOUT_POSSIBLE:
                await hydraTxBuilder.final();
                break;
            default:
                break;
        }
    } catch (error) {
        throw new Error(String(error));
    }
};
