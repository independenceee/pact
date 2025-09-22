import { deserializeAddress, mConStr0, mConStr1, mTuple, MTuple, list } from "@meshsdk/core";
import { MeshAdapter } from "~/adapters/mesh.adapter";
import { DECIMAL_PLACE } from "~/constants/common";
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
    public contribute = async ({ quantity }: { quantity: number }): Promise<string> => {
        const { utxos, collateral, walletAddress } = await this.getWalletForTx();
        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const stakeCredentialHash = deserializeAddress(walletAddress).stakeCredentialHash;

        const utxoInput = this.getUTxOOnlyLovelace({
            utxos: utxos,
            quantity: quantity,
        });

        const utxoContract = (await this.fetcher.fetchAddressUTxOs(this.spendAddress))[0];
        const unsignedTx = this.meshTxBuilder;

        if (utxoContract) {
            unsignedTx
                .spendingPlutusScriptV3()
                .txIn(utxoContract.input.txHash, utxoContract.input.outputIndex)
                .txInInlineDatumPresent()
                .txInRedeemerValue(mConStr0([pubKeyHash]))
                .txInScript(this.spendScriptCbor)
                .txOut(this.spendAddress, utxoContract.output.amount)
                .txOutInlineDatumValue(
                    mConStr0([
                        mTuple([
                            mConStr0([pubKeyHash, stakeCredentialHash]),
                            quantity * DECIMAL_PLACE,
                            mConStr0([pubKeyHash, stakeCredentialHash]),
                            quantity * DECIMAL_PLACE,
                        ]),
                        mConStr0([pubKeyHash, stakeCredentialHash]),
                        10 * DECIMAL_PLACE,
                    ]),
                );
        } else {
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
                        mTuple([
                            mConStr0([pubKeyHash, stakeCredentialHash]),
                            quantity * DECIMAL_PLACE,
                            mConStr0([pubKeyHash, stakeCredentialHash]),
                            quantity * DECIMAL_PLACE,
                        ]),
                        mConStr0([pubKeyHash, stakeCredentialHash]),
                        10 * DECIMAL_PLACE,
                    ]),
                );
        }
        unsignedTx
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
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

        console.log(await this.fetcher.fetchAddressUTxOs(this.spendAddress));

        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr1([]))
            .txInScript(this.spendScriptCbor)
            .txOut(walletAddress, utxo.output.amount)

            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .requiredSignerHash(pubKeyHash)
            .changeAddress(walletAddress)
            .setNetwork(APP_NETWORK)
            .selectUtxosFrom(utxos);

        return await unsignedTx.complete();
    };
}
