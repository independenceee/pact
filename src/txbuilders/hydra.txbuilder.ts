import { mConStr0, deserializeAddress, list, mTuple, mConStr1 } from "@meshsdk/core";
import { HydraAdapter } from "~/adapters/hydra.adapter";
import { DECIMAL_PLACE } from "~/constants/common";
import { APP_NETWORK } from "~/constants/enviroments";

/**
 * @description
 * HydraTxBuilder class provides a wrapper around Mesh SDK for:
 * - Managing Plutus scripts (mint & spend)
 * - Resolving policy IDs and script addresses
 * - Handling wallet UTxOs and collaterals
 * - Preparing data for transaction building
 */
export class HydraTxBuilder extends HydraAdapter {
    /**
     * @description Locks a specific amount of lovelace into the Hydra contract address.
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
    lock = async ({ amount = 10 }: { amount: number }) => {
        await this.hydraProvider.connect();
        const { utxos, collateral, walletAddress } = await this.getWalletForHydraTx();
        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const stakeCredentialHash = deserializeAddress(walletAddress).stakeCredentialHash;

        const utxo = this.getUTxOOnlyLovelace({
            utxos: utxos,
            quantity: amount,
        });

        const unsignedTx = this.meshTxBuilder
            .txIn(utxo.input.txHash, utxo.input.outputIndex)
            .txOut(this.spendAddress, [
                {
                    unit: "lovelace",
                    quantity: String(amount * DECIMAL_PLACE),
                },
            ])
            .txOutInlineDatumValue(
                mConStr0([
                    mTuple(
                        [mConStr0([pubKeyHash, stakeCredentialHash]), 10 * DECIMAL_PLACE],
                        [mConStr0([pubKeyHash, stakeCredentialHash]), 10 * DECIMAL_PLACE],
                    ),
                    mConStr0([pubKeyHash, stakeCredentialHash]),
                    10 * DECIMAL_PLACE,
                ]),
            )
            .changeAddress(walletAddress)
            .selectUtxosFrom(utxos)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setFee(String(0))
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };

    /**
     * @description Unlocks previously locked lovelace from the Hydra contract.
     * This function prepares a transaction that spends the UTxO locked at the
     * Hydra contract address using the provided Plutus script and redeemer.
     *
     * @returns {Promise<any>} - An unsigned transaction object ready to be signed and submitted.
     *
     * @throws {Error} - Throws if UTxOs are insufficient, collateral is missing,
     * or contract UTxOs cannot be retrieved.
     *
     * @example
     * const tx = await hydraTxBuilder.unLock();
     * // Sign and submit transaction...
     */
    unLock = async () => {
        await this.hydraProvider.connect();
        const { utxos, collateral, walletAddress } = await this.getWalletForHydraTx();
        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const utxosSpendAddress = await this.hydraProvider.fetchAddressUTxOs(this.spendAddress);
        console.log(utxosSpendAddress[2]);

        const unsignedTx = this.meshTxBuilder

            .spendingPlutusScriptV3()
            .txIn(utxosSpendAddress[2].input.txHash, utxosSpendAddress[2].input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr0([pubKeyHash]))
            .txInScript(this.spendScriptCbor)
            .txOut(walletAddress, utxosSpendAddress[2].output.amount)

            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .requiredSignerHash(pubKeyHash)
            .changeAddress(walletAddress)
            .setNetwork(APP_NETWORK)
            .selectUtxosFrom(utxos)
            .setFee(String(0));

        return await unsignedTx.complete();
    };

    /**
     * @description Removes previously locked lovelace from the Hydra contract.
     * This function prepares a transaction that spends the UTxO locked at the
     * Hydra contract address using the provided Plutus script and redeemer.
     *
     * @returns {Promise<any>} - An unsigned transaction object ready to be signed and submitted.
     *
     * @throws {Error} - Throws if UTxOs are insufficient, collateral is missing,
     * or contract UTxOs cannot be retrieved.
     */
    removes = async () => {
        await this.hydraProvider.connect();
        const { utxos, collateral, walletAddress } = await this.getWalletForHydraTx();
        const utxosSpendAddress = await this.hydraProvider.fetchAddressUTxOs(this.spendAddress);

        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;

        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxosSpendAddress[1].input.txHash, utxosSpendAddress[1].input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr1([]))
            .txInScript(this.spendScriptCbor)
            .txOut(walletAddress, utxosSpendAddress[1].output.amount)
            .changeAddress(walletAddress)
            .selectUtxosFrom(utxos)
            .setFee(String(0))
            .requiredSignerHash(pubKeyHash)
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };
}
