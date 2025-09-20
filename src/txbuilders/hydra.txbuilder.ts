import { mConStr0 } from "@meshsdk/core";
import { HydraAdapter } from "~/adapters/hydra.adapter";
import { DECIMAL_PLACE } from "~/constants/common";
import { APP_NETWORK } from "~/constants/enviroments";

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
     *
     * @example
     * const tx = await hydraTxBuilder.lock({ amount: 50 });
     * // Sign and submit transaction...
     */
    lock = async ({ amount = 10 }: { amount: number }) => {
        await this.hydraProvider.connect();
        const { utxos, collateral, walletAddress } = await this.getWalletForHydraTx();
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
            .txOutInlineDatumValue(mConStr0([]))
            .changeAddress(await this.meshWallet.getChangeAddress())
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
        const utxosSpendAddress = await this.hydraProvider.fetchAddressUTxOs(this.spendAddress);
        const unsignedTx = this.meshTxBuilder
            .spendingPlutusScriptV3()
            .txIn(utxosSpendAddress[0].input.txHash, utxosSpendAddress[0].input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr0([]))
            .txInScript(this.spendScriptCbor)
            .changeAddress(walletAddress)
            .selectUtxosFrom(utxos)
            .setFee(String(0))
            .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };
}
