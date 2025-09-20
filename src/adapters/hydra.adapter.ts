import { IFetcher, MeshTxBuilder, MeshWallet } from "@meshsdk/core";
import { HydraInstance, HydraProvider } from "@meshsdk/hydra";
import { blockfrostProvider } from "~/providers/cardano";

/**
 * @description HydraAdapter base class for Hydra transactions and operations.
 * It provides helper methods to:
 * - Initialize Hydra connection
 * - Manage lifecycle of Hydra head (init, close, finalize, abort, fanout)
 * - Handle UTxOs (commit, decommit, filter Lovelace-only UTxOs)
 * - Provide access to MeshTxBuilder configured for Hydra
 */
export class HydraAdapter {
    protected fetcher: IFetcher;
    protected meshWallet: MeshWallet;
    public meshTxBuilder!: MeshTxBuilder;
    public hydraInstance!: HydraInstance;
    public hydraProvider: HydraProvider;


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
                        if(message.tag === "HeadIsInitializing") {
                            resolve();
                        }
                    } catch(error) {
                        reject(error)
                    }
                })

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

}