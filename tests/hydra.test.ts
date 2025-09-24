import { MeshWallet } from "@meshsdk/core";
import { HydraProvider } from "@meshsdk/hydra";
import { APP_NETWORK_ID, HYDRA_HTTP_URL, HYDRA_WS_URL, HYDRA_HTTP_URL_SUB, HYDRA_WS_URL_SUB } from "~/constants/enviroments";
import { blockfrostProvider } from "~/libs/cardano";
import { HydraTxBuilder } from "~/txbuilders/hydra.txbuilder";

describe("Pact is a multi-party decentralized application (dApp) built on Cardano’s Hydra Head, designed to enable groups of people to safely pool funds for a shared goal (e.g., co-purchasing an NFT, funding a small project, or creating a community treasury).", function () {
    let meshWallet: MeshWallet;
    // let isCreator: boolean = true; // Use for Alice
    let isCreator: boolean = false; // Use for Bob
    let hydraProvider: HydraProvider;

    beforeEach(async function () {
        meshWallet = new MeshWallet({
            networkId: APP_NETWORK_ID,
            fetcher: blockfrostProvider,
            submitter: blockfrostProvider,
            key: {
                type: "mnemonic",
                // words: process.env.APP_MNEMONIC?.split(" ") || [],
                words: process.env.BOB_APP_MNEMONIC?.split(" ") || [],
                // words: process.env.ALICE_APP_MNEMONIC?.split(" ") || [],
            },
        });

        hydraProvider = new HydraProvider({
            httpUrl: isCreator ? HYDRA_HTTP_URL : HYDRA_HTTP_URL_SUB,
            wsUrl: isCreator ? HYDRA_WS_URL : HYDRA_WS_URL_SUB,
        });
    });

    jest.setTimeout(60_000_000_000);

    describe("Common and basic state management in head hydra", function () {
        it("Initializing Head creation and UTxO commitment phase.", async () => {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.init();
            } catch (error) {
                console.log(error);
            }
        });

        it("Closed Head closed, starting contestation phase.", async () => {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.close();
            } catch (error) {
                console.log(error);
            }
        });

        it("Ready to fanout  Snapshot finalized, ready for layer-1 distribution.", async () => {
            // return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.fanout();
            } catch (error) {
                console.log(error);
            }
        });

        it("Finalized Head completed, UTxOs returned to layer-1.", async function () {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.final();
            } catch (error) {
                console.log(error);
            }
        });

        it("Aborted Head canceled before opening.", async () => {
            return;
            try {
                const hydraTxBuilder = new HydraTxBuilder({
                    meshWallet: meshWallet,
                    hydraProvider: hydraProvider,
                });

                await hydraTxBuilder.abort();
            } catch (error) {
                console.log(error);
            }
        });

        it("Get status on head hydra when hydra interact", async function () {});
    });

    describe("Implement full fund lifecycle within Hydra head (commit funds into head and decommit them back to main chain)", () => {
        it("1- Commit UTXOs into the Hydra head to make them available for off-chain transactions.", async () => {
            return;
            const hydraTxBuilder = new HydraTxBuilder({
                meshWallet: meshWallet,
                hydraProvider: hydraProvider,
            });
            await hydraTxBuilder.initialize();
            const commitUnsignedTx = await hydraTxBuilder.commit({ amount: 100 });
            const commitSignedTx = await meshWallet.signTx(commitUnsignedTx, true);
            const commitTxHash = await meshWallet.submitTx(commitSignedTx);
            console.log("https://preview.cexplorer.io/tx/" + commitTxHash);
            const snapshotUtxos = await hydraProvider.subscribeSnapshotUtxo();
            console.log(snapshotUtxos);
        });

        it("2- Commit UTXOs into the Hydra head to make them available for off-chain transactions.", async () => {
            return;
        });

        it("1- Decommit UTXOs from the Hydra head, withdrawing funds back to the Cardano main chain.", async () => {
            return;
        });

        it("2- Decommit UTXOs from the Hydra head, withdrawing funds back to the Cardano main chain.", async () => {
            return;
        });
    });

    describe("Transaction processing in hydra from basic to advanced", function () {
        it("Lovelace transfer from one address to another", async function () {});

        it("Transfer funds from one address to another with datum", async function () {
            return;
        });

        it("Mint assets via forge script with CIP25", async function () {
            return;
        });

        it("Asset transfer from one address to another", async function () {
            return;
        });

        it("Burn assets via forge script with CIP25", async function () {
            return;
        });
    });

    describe("Hydra interaction with smartcontract", function () {
        it("Locks a specific amount of lovelace into the Hydra contract address.", async function () {
            return;
            const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({
                meshWallet: meshWallet,
                hydraProvider: hydraProvider,
            });
            await hydraTxBuilder.initialize();

            const unsignedTx: string = await hydraTxBuilder.contribute({ quantity: 10, required: 0 });
            const signedTx: string = await meshWallet.signTx(unsignedTx, true);
            await hydraTxBuilder.submitTx({ signedTx: signedTx });
        });

        it("Unlocks previously locked lovelace from the Hydra contract.", async function () {
            return;
            const hydraTxBuilder: HydraTxBuilder = new HydraTxBuilder({
                meshWallet: meshWallet,
                hydraProvider: hydraProvider,
            });
            await hydraTxBuilder.initialize();

            const unsignedTx: string = await hydraTxBuilder.disburse();
            const signedTx: string = await meshWallet.signTx(unsignedTx, true);
            await hydraTxBuilder.submitTx({ signedTx: signedTx });
        });
    });
});
