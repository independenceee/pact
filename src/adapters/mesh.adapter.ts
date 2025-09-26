/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    applyParamsToScript,
    deserializeAddress,
    deserializeDatum,
    IFetcher,
    MeshTxBuilder,
    MeshWallet,
    PlutusScript,
    pubKeyAddress,
    scriptAddress,
    serializeAddressObj,
    serializePlutusScript,
    UTxO,
} from "@meshsdk/core";
import { blockfrostProvider } from "~/libs/cardano";
import plutus from "../../contract/plutus.json";
import { Plutus } from "~/types";
import { DECIMAL_PLACE, title } from "~/constants/common";
import { APP_NETWORK_ID } from "~/constants/enviroments";

/**
 * @description
 * MeshAdapter class provides a wrapper around Mesh SDK for:
 * - Managing Plutus scripts (mint & spend)
 * - Resolving policy IDs and script addresses
 * - Handling wallet UTxOs and collaterals
 * - Preparing data for transaction building
 */
export class MeshAdapter {
    public spendAddress: string;
    protected spendCompileCode: string;
    protected spendScriptCbor: string;
    protected spendScript: PlutusScript;
    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;
    protected meshTxBuilder: MeshTxBuilder;

    /**
     * @description
     * Construct a MeshAdapter instance.
     * This sets up:
     * - Plutus scripts (mint & spend)
     * - Script addresses
     * - Policy ID resolution
     *
     * @param {MeshWallet} meshWallet - Active Mesh wallet instance to connect.
     */
    constructor({ meshWallet = null! }: { meshWallet: MeshWallet }) {
        this.meshWallet = meshWallet;
        this.fetcher = blockfrostProvider;
        this.meshTxBuilder = new MeshTxBuilder({
            fetcher: this.fetcher,
            evaluator: blockfrostProvider,
        });

        this.spendCompileCode = this.readValidator(plutus as Plutus, title.spend);

        this.spendScriptCbor = applyParamsToScript(this.spendCompileCode, []);

        this.spendScript = {
            code: this.spendScriptCbor,
            version: "V3",
        };

        this.spendAddress = serializeAddressObj(
            scriptAddress(
                deserializeAddress(serializePlutusScript(this.spendScript, undefined, APP_NETWORK_ID, false).address)
                    .scriptHash,
                "",
                false,
            ),
            APP_NETWORK_ID,
        );
    }

    /**
     * @description
     * Retrieve wallet essentials for building a transaction:
     * - Available UTxOs
     * - A valid collateral UTxO (>= 5 ADA in lovelace)
     * - Wallet's change address
     *
     * Flow:
     * 1. Get all wallet UTxOs.
     * 2. Ensure collateral exists (create one if missing).
     * 3. Get wallet change address.
     *
     * @returns {Promise<{ utxos: UTxO[]; collateral: UTxO; walletAddress: string }>}
     *          Object containing wallet UTxOs, a collateral UTxO, and change address.
     *
     * @throws {Error}
     *         If UTxOs or wallet address cannot be retrieved.
     */
    protected getWalletForTx = async (): Promise<{
        utxos: UTxO[];
        collateral: UTxO;
        walletAddress: string;
    }> => {
        const utxos = await this.meshWallet.getUtxos();
        const collaterals =
            (await this.meshWallet.getCollateral()).length === 0
                ? [await this.getCollateral()]
                : await this.meshWallet.getCollateral();
        const walletAddress = await this.meshWallet.getChangeAddress();
        if (!utxos || utxos.length === 0) throw new Error("No UTXOs found in getWalletForTx method.");

        if (!collaterals || collaterals.length === 0) this.meshWallet.createCollateral();

        if (!walletAddress) throw new Error("No wallet address found in getWalletForTx method.");

        return { utxos, collateral: collaterals[0], walletAddress };
    };

    /**
     * @description
     * Read a specific Plutus validator from a compiled Plutus JSON object.
     *
     * @param {Plutus} plutus - The Plutus JSON file (compiled).
     * @param {string} title - The validator title to search for.
     *
     * @returns {string}
     *          Compiled Plutus script code as a hex string.
     *
     * @throws {Error}
     *         If validator with given title is not found.
     *
     */
    protected readValidator = function (plutus: Plutus, title: string): string {
        const validator = plutus.validators.find(function (validator) {
            return validator.title === title;
        });

        if (!validator) {
            throw new Error(`${title} validator not found.`);
        }

        return validator.compiledCode;
    };

    /**
     * @description
     * Fetch the last UTxO at a given address containing a specific asset.
     *
     * @param {string} address - Address to query.
     * @param {string} unit - Asset unit (policyId + hex-encoded name or "lovelace").
     *
     * @returns {Promise<UTxO>}
     *          The last matching UTxO for the specified asset.
     */
    protected getAddressUTXOAsset = async (address: string, unit: string) => {
        const utxos = await this.fetcher.fetchAddressUTxOs(address, unit);
        return utxos[utxos.length - 1];
    };

    /**
     * @description
     * Fetch all UTxOs at a given address containing a specific asset.
     *
     * @param {string} address - Address to query.
     * @param {string} unit - Asset unit (policyId + hex-encoded name or "lovelace").
     *
     * @returns {Promise<UTxO[]>}
     *          List of UTxOs with the specified asset.
     */
    protected getAddressUTXOAssets = async (address: string, unit: string) => {
        return await this.fetcher.fetchAddressUTxOs(address, unit);
    };

    /**
     * @description
     * Select a UTxO from wallet to serve as collateral for Plutus script transactions.
     *
     * Rules:
     * - Must contain only Lovelace.
     * - Must have quantity >= 5 ADA (5,000,000 lovelace).
     *
     * @returns {Promise<UTxO>}
     *          A UTxO that can be used as collateral.
     */
    protected getCollateral = async (): Promise<UTxO> => {
        const utxos = await this.meshWallet.getUtxos();
        return utxos.filter((utxo) => {
            const amount = utxo.output.amount;
            return (
                Array.isArray(amount) &&
                amount.length === 1 &&
                amount[0].unit === "lovelace" &&
                typeof amount[0].quantity === "string" &&
                Number(amount[0].quantity) >= 5_000_000
            );
        })[0];
    };

    /**
     * @description
     * Retrieve the first UTxO containing only Lovelace above a specified minimum threshold.
     *
     * This method filters out:
     * - UTxOs that include any non-ADA assets (e.g., native tokens).
     * - UTxOs with Lovelace amount smaller than the required threshold.
     *
     * Then, it sorts the eligible UTxOs in ascending order and returns the smallest valid one.
     *
     * @param {UTxO[]} utxos
     *        List of available UTxOs to evaluate.
     *
     * @param {number} quantity
     *        Minimum required Lovelace amount. Default is `DECIMAL_PLACE`.
     *
     * @returns {UTxO | undefined}
     *          The first valid Lovelace-only UTxO, or `undefined` if none is found.
     */
    public getUTxOOnlyLovelace = ({ utxos, quantity = DECIMAL_PLACE }: { utxos: Array<UTxO>; quantity: number }) => {
        const filteredUTxOs = utxos.filter((utxo) => {
            const amount = utxo.output?.amount;
            if (!Array.isArray(amount) || amount.length !== 1) return false;
            const { unit, quantity: qty } = amount[0];
            const quantityNum = Number(qty);
            return unit === "lovelace" && typeof qty === "string" && !isNaN(quantityNum) && quantityNum >= quantity;
        });

        return filteredUTxOs.sort((a, b) => {
            const qtyA = Number(a.output.amount[0].quantity);
            const qtyB = Number(b.output.amount[0].quantity);
            return qtyA - qtyB;
        })[0];
    };

    /**
     * @description
     * Retrieve wallet essentials for building a transaction:
     * - Available UTxOs
     * - A valid collateral UTxO (>= 5 ADA in lovelace)
     * - Wallet's change address
     *
     * Flow:
     * 1. Get all wallet UTxOs.
     * 2. Ensure collateral exists (create one if missing).
     * 3. Get wallet change address.
     *
     * @returns {Promise<{ utxos: UTxO[]; collateral: UTxO; walletAddress: string }>}
     *          Object containing wallet UTxOs, a collateral UTxO, and change address.
     *
     * @throws {Error}
     *         If UTxOs or wallet address cannot be retrieved.
     */
    protected convertDatum = ({
        plutusData,
    }: {
        plutusData: string;
    }): {
        participants: Array<{ walletAddress: string; amount: number }>;
        destination: string;
        required: number;
    } => {
        try {
            const datum = deserializeDatum(plutusData);
            const destination = serializeAddressObj(
                pubKeyAddress(datum.fields[1].fields[0].bytes, datum.fields[1].fields[1].bytes, false),
                APP_NETWORK_ID,
            );

            const participants = datum.fields[0].list.map((item: any) => {
                const [pubKeyHash, stakeCredentialHash] = item.list[0].fields.map((f: any) => f.bytes);
                const amount = Number(item.list[1].int);
                return {
                    walletAddress: serializeAddressObj(
                        pubKeyAddress(pubKeyHash, stakeCredentialHash, false),
                        APP_NETWORK_ID,
                    ),
                    amount: amount,
                };
            });

            return {
                participants: participants,
                destination: destination,
                required: Number(datum.fields[2].int),
            };
        } catch (error) {
            throw new Error(String(error));
        }
    };
}
