/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    applyParamsToScript,
    deserializeAddress,
    IFetcher,
    MeshTxBuilder,
    MeshWallet,
    PlutusScript,
    scriptAddress,
    serializeAddressObj,
    pubKeyAddress,
    UTxO,
    serializePlutusScript,
    deserializeDatum,
} from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
import { DECIMAL_PLACE, title } from "~/constants/common.constant";
import { blockfrostProvider } from "~/libs/cardano";
import plutus from "../../contract/plutus.json";
import { Plutus } from "~/types";
import { APP_NETWORK_ID } from "~/constants/enviroments.constant";

/**
 * @description HydraAdapter base class for Hydra transactions and operations.
 * It provides helper methods to:
 * - Initialize Hydra connection
 * - Manage lifecycle of Hydra head (init, close, finalize, abort, fanout)
 * - Handle UTxOs (commit, decommit, filter Lovelace-only UTxOs)
 * - Provide access to MeshTxBuilder configured for Hydra
 */
export class HydraAdapter {
    public meshTxBuilder!: MeshTxBuilder;
    public hydraInstance!: HydraInstance;
    public hydraProvider: HydraProvider;
    public spendAddress: string;
    protected spendCompileCode: string;
    protected spendScriptCbor: string;
    protected spendScript: PlutusScript;
    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;

    /**
     * @param meshWallet - The MeshWallet instance to interact with user wallet.
     * @param hydraProvider - The HydraProvider instance to interact with Hydra head.
     */
    constructor({ meshWallet, hydraProvider }: { meshWallet: MeshWallet; hydraProvider: HydraProvider }) {
        this.meshWallet = meshWallet;
        this.fetcher = blockfrostProvider;
        this.hydraProvider = hydraProvider;
        this.hydraInstance = new HydraInstance({
            submitter: blockfrostProvider,
            provider: this.hydraProvider,
            fetcher: blockfrostProvider,
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
     * Initialize the MeshTxBuilder with protocol parameters fetched from the Hydra provider.
     * This step is mandatory before constructing or submitting any transactions within Hydra.
     *
     * The function performs the following:
     * 1. Fetches current protocol parameters from HydraProvider.
     * 2. Initializes a MeshTxBuilder instance configured for Hydra operations.
     * 3. Establishes connection with the Hydra head.
     *
     * @returns {Promise<void>}
     *          Resolves when the MeshTxBuilder is ready to use.
     *
     * @throws {Error}
     *         Throws if fetching protocol parameters or connecting to Hydra fails.
     */
    public async initialize() {
        const protocolParameters = await this.hydraProvider.fetchProtocolParameters();
        this.meshTxBuilder = new MeshTxBuilder({
            params: protocolParameters,
            fetcher: this.hydraProvider,
            submitter: this.hydraProvider,
            isHydra: true,
        });
        await this.connect();
    }

    /**
     * @description
     * Establishes connection to the Hydra provider.
     *
     * Must be called before any operation that interacts with the Hydra network.
     *
     * @returns {Promise<void>}
     *          Resolves when successfully connected.
     *
     * @throws {Error}
     *         Throws if the Hydra provider connection fails.
     */
    public connect = async () => {
        try {
            await this.hydraProvider.connect();
        } catch (error) {
            throw error;
        }
    };

    /**
     * @description
     * Initialize Hydra head creation and UTxO commitment phase.
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `init` process.
     * 3. Listen for status changes.
     * 4. Resolve when status becomes `"INITIALIZING"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head initialization is confirmed.
     *
     * @throws {Error}
     *         Throws if Hydra init fails or provider reports error.
     */
    public init = async (): Promise<void> => {
        try {
            await this.connect();
            await new Promise<void>((resolve, reject) => {
                this.hydraProvider.init().catch((error: Error) => reject(error));

                this.hydraProvider.onMessage((message) => {
                    try {
                        if (message.tag === "HeadIsInitializing") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });

                this.hydraProvider.onStatusChange((status) => {
                    try {
                        if (status === "INITIALIZING") {
                            resolve();
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        } catch (error) {
            throw error;
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
    public fanout = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.fanout().catch((error: Error) => reject(error));

            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "ReadyToFanout") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "FANOUT_POSSIBLE") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "HeadIsFinalized") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "FINAL") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description
     * Finalize the Hydra head. At this stage, all UTxOs
     * are returned back to the Cardano layer-1.
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `fanout`.
     * 3. Listen for status `"FINAL"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head reaches final state.
     *
     * @throws {Error}
     *         Throws if finalization fails.
     */
    public final = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.fanout().catch((error: Error) => reject(error));

            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "ReadyToFanout") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "FANOUT_POSSIBLE") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "HeadIsFinalized") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });

            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "FINAL") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description
     * Close the Hydra head, entering the contestation phase.
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `close`.
     * 3. Listen for status `"CLOSED"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head is closed.
     *
     * @throws {Error}
     *         Throws if closing the head fails.
     */
    public close = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.close().catch((error: Error) => reject(error));

            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "HeadIsClosed") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "CLOSED") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description
     * Abort Hydra head creation.
     * Used if initialization cannot proceed (e.g., not enough participants).
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `abort`.
     * 3. Listen for status `"OPEN"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head is aborted.
     *
     * @throws {Error}
     *         Throws if aborting fails.
     */
    public abort = async () => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.abort().catch((error: Error) => reject(error));

            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "HeadIsAborted") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
            this.hydraProvider.onStatusChange((status) => {
                try {
                    if (status === "OPEN") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description
     * Submit Transaction Hydra head.
     * Used if initialization cannot proceed (e.g., not enough participants).
     *
     * Flow:
     * 1. Connect to Hydra provider.
     * 2. Trigger Hydra `abort`.
     * 3. Listen for status `"OPEN"`.
     *
     * @returns {Promise<void>}
     *          Resolves when Hydra head is aborted.
     *
     * @throws {Error}
     *         Throws if aborting fails.
     */
    public submitTx = async ({ signedTx }: { signedTx: string }) => {
        await this.hydraProvider.connect();
        await new Promise<void>((resolve, reject) => {
            this.hydraProvider.submitTx(signedTx).catch((error: Error) => reject(error));

            this.hydraProvider.onMessage((message) => {
                try {
                    if (message.tag === "SnapshotConfirmed") {
                        resolve();
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    /**
     * @description
     * Commit UTxOs into the Hydra head so that they become available for off-chain Hydra transactions.
     *
     * Behavior:
     * - If `input` is provided, commit that specific UTxO.
     * - If no input is provided, the function automatically selects the first Lovelace-only UTxO
     *   above a default threshold (10 ADA) by calling `getUTxOOnlyLovelace()`.
     *
     * This operation is crucial for enabling the wallet's funds to be used inside Hydra off-chain layer.
     *
     * @param {Object} param
     * @param {string} [param.input.txHash] - Transaction hash of the UTxO to commit.
     * @param {number} [param.input.outputIndex] - Output index of the UTxO.
     *
     * @returns {Promise<string>}
     *          An unsigned transaction string for committing the UTxO into Hydra.
     *
     * @throws {Error}
     *         Throws if no valid UTxO is found or Hydra provider connection fails.
     */
    public commit = async ({
        input,
        amount = 10,
        exactly = false,
    }: {
        input?: {
            txHash: string;
            outputIndex: number;
        };
        amount?: number;
        exactly?: boolean;
    }): Promise<string> => {
        await this.hydraProvider.connect();
        if (!exactly) {
            const utxos = await this.meshWallet.getUtxos();
            const utxoOnlyLovelace = this.getUTxOOnlyLovelace({
                utxos: utxos,
                quantity: DECIMAL_PLACE * amount,
            });

            if (input) {
                return await this.hydraInstance.commitFunds(input.txHash, input.outputIndex);
            }

            return await this.hydraInstance.commitFunds(
                utxoOnlyLovelace.input.txHash,
                utxoOnlyLovelace.input.outputIndex,
            );
        }

        const unsignedTx = await this.meshTxBuilder
            .txIn(input?.txHash as string, input?.outputIndex as number)
            .setFee("0")
            .changeAddress(await this.meshWallet.getChangeAddress())
            .selectUtxosFrom(await this.meshWallet.getUtxos())
            .complete();
        return await this.hydraInstance.commitBlueprint(input?.txHash as string, input?.outputIndex as number, {
            type: "Tx ConwayEra",
            cborHex: unsignedTx,
            description: "Commit Blueprint",
        });
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
    protected getWalletForHydraTx = async (): Promise<{
        utxos: UTxO[];
        collateral: UTxO;
        walletAddress: string;
    }> => {
        const walletAddress = await this.meshWallet.getChangeAddress();
        const utxos = await this.hydraProvider.fetchAddressUTxOs(walletAddress);
        const collateral = await this.getUTxOOnlyLovelace({ utxos: utxos, quantity: 5 });
        if (!collateral) throw new Error("No UTXOs collapteral found in getWalletForHydraTx method.");
        if (!utxos || utxos.length === 0) throw new Error("No UTXOs found in getWalletForHydraTx method.");
        if (!walletAddress) throw new Error("No wallet address found in getWalletForHydraTx method.");

        return {
            utxos: utxos,
            collateral: collateral,
            walletAddress: walletAddress,
        };
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
    protected getParticipantsForHydraTx = async (): Promise<Array<string>> => {
        try {
            const utxos = await this.hydraProvider.fetchUTxOs();
            if (!utxos || !Array.isArray(utxos)) {
                throw new Error("Failed to fetch valid UTxOs");
            }

            const addresses = utxos
                .map((utxo) => utxo.output.address)
                .filter((address): address is string => typeof address === "string")
                .map((address) => address)
                .filter((value, index, self) => index === self.findIndex((address) => address === value));

            return addresses;
        } catch (error) {
            throw new Error("Unable to retrieve participants for Hydra transaction");
        }
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
