import { deserializeAddress, mConStr0, mConStr1, mTuple } from "@meshsdk/core";
import { MeshAdapter } from "~/adapters/mesh.adapter";
import { DECIMAL_PLACE } from "~/constants/common.constant";
import { APP_NETWORK } from "~/constants/enviroments";

/**
 * @description
 * MeshTxBuilder class provides a wrapper around Mesh SDK for:
 * - Managing Plutus scripts (mint & spend)
 * - Resolving policy IDs and script addresses
 * - Handling wallet UTxOs and collaterals
 * - Preparing data for transaction building
 */
export class MeshTxBuilder extends MeshAdapter {
    public contribute = async ({
        destination,
        required = 10,
        quantity = 1,
    }: {
        destination?: string;
        required?: number;
        quantity?: number;
    }): Promise<string> => {
        const { utxos, collateral, walletAddress } = await this.getWalletForTx();
        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;

        const utxoInput = this.getUTxOOnlyLovelace({
            utxos: utxos,
            quantity: quantity * DECIMAL_PLACE,
        });

        console.log(await this.fetcher.fetchAddressUTxOs(this.spendAddress));
        const utxoContract = (await this.fetcher.fetchAddressUTxOs(this.spendAddress))[0];
        const unsignedTx = this.meshTxBuilder;

        if (utxoContract) {
            const datum = this.convertDatum({
                plutusData: utxoContract.output.plutusData as string,
            });

            unsignedTx
                // .txIn(utxoInput.input.txHash, utxoInput.input.outputIndex)
                .spendingPlutusScriptV3()
                .txIn(utxoContract.input.txHash, utxoContract.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr0([pubKeyHash]))
                .txInScript(this.spendScriptCbor)
                .txOut(this.spendAddress, [
                    {
                        unit: "lovelace",
                        quantity: String(Number(utxoContract.output.amount[0].quantity)),
                    },
                ])
                .txOutInlineDatumValue(
                    mConStr0([
                        mTuple(
                            ...datum.participants.map(({ walletAddress, amount }) => [
                                mConStr0([
                                    deserializeAddress(walletAddress).pubKeyHash,
                                    deserializeAddress(walletAddress).stakeCredentialHash,
                                ]),
                                amount,
                            ]),
                        ),
                        mConStr0([
                            deserializeAddress(datum.destination).pubKeyHash,
                            deserializeAddress(datum.destination).stakeCredentialHash,
                        ]),
                        0,
                    ]),
                );
            // .txOut(this.spendAddress, [
            //     {
            //         unit: "lovelace",
            //         quantity: String(quantity * DECIMAL_PLACE),
            //     },
            // ]);
            // .txOutInlineDatumValue(
            //     mConStr0([
            //         mTuple(
            //             ...datum.participants.map(({ walletAddress, amount }) => [
            //                 mConStr0([
            //                     deserializeAddress(walletAddress).pubKeyHash,
            //                     deserializeAddress(walletAddress).stakeCredentialHash,
            //                 ]),
            //                 amount,
            //             ]),
            //         ),
            //         mConStr0([
            //             deserializeAddress(datum.destination).pubKeyHash,
            //             deserializeAddress(datum.destination).stakeCredentialHash,
            //         ]),
            //         required,
            //     ]),
            // )
            // .txOut(walletAddress, [
            //     {
            //         unit: "lovelace",
            //         quantity: String(Number(utxoInput.output.amount[0].quantity) - quantity * DECIMAL_PLACE),
            //     },
            // ]);
        } else {
            const participants = [
                walletAddress,
                "addr_test1qzk0hl57jzwu2p0kpuqs48q2f7vty8efhcwh4l8wynckp4se2hwvvldt8r4c3cr7dcszlt2f7xs5ef2hydn25pugcgvs4843vd",
            ];

            unsignedTx
                .txIn(utxoInput.input.txHash, utxoInput.input.outputIndex)
                .txOut(this.spendAddress, [
                    {
                        unit: "lovelace",
                        quantity: String(quantity * DECIMAL_PLACE),
                    },
                ])
                .txOutInlineDatumValue(
                    mConStr0([
                        mTuple(
                            ...participants.map((participant) => [
                                mConStr0([
                                    deserializeAddress(participant).pubKeyHash,
                                    deserializeAddress(participant).stakeCredentialHash,
                                ]),
                                required * DECIMAL_PLACE,
                            ]),
                        ),
                        mConStr0([
                            deserializeAddress(destination || walletAddress).pubKeyHash,
                            deserializeAddress(destination || walletAddress).stakeCredentialHash,
                        ]),
                        (required as number) * DECIMAL_PLACE,
                    ]),
                );
        }
        unsignedTx
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .requiredSignerHash(pubKeyHash)
            .changeAddress(walletAddress)
            .setNetwork(APP_NETWORK)
            .selectUtxosFrom(utxos);

        return await unsignedTx.complete();
    };

    public disburse = async (): Promise<string> => {
        const { utxos, collateral, walletAddress } = await this.getWalletForTx();
        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const utxo = (await this.fetcher.fetchAddressUTxOs(this.spendAddress))[0];

        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr1([]))
            .txInScript(this.spendScriptCbor)
            .txOut(walletAddress, utxo.output.amount)

            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .requiredSignerHash(pubKeyHash)
            .changeAddress(walletAddress)
            .setNetwork(APP_NETWORK)
            .selectUtxosFrom(utxos);

        return await unsignedTx.complete();
    };
}
