import { mConStr0 } from "@meshsdk/core";
import { HydraAdapter } from "~/adapters/hydra.adapter";
import { DECIMAL_PLACE } from "~/constants/common";
import { APP_NETWORK } from "~/constants/enviroments";

export class HydraTxBuilder extends HydraAdapter {
    /**
     * @description Create a transaction that transfers lovelace from the current wallet
     * to a specific address on the Hydra network.
     *
     * @param {Object} params
     * @param {string} params.tipAddress - The recipient address where lovelace will be sent.
     * @param {number} [params.amount=DECIMAL_PLACE] - The amount of lovelace to send (default is DECIMAL_PLACE).
     *
     * @returns {Promise<any>} - An unsigned transaction ready to be signed and submitted.
     *
     * @throws {Error} - Throws if UTxOs are insufficient or wallet address cannot be retrieved.
     */
    lock = async ({ amount = 10 }: { amount: number }) => {
        await this.hydraProvider.connect();
        const utxos = await this.hydraProvider.fetchAddressUTxOs(await this.meshWallet.getChangeAddress());
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
            .setFee(String(0))
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };

    /**
     * @description Create a transaction that transfers lovelace from the current wallet
     * to a specific address on the Hydra network.
     *
     * @param {Object} params
     * @param {string} params.tipAddress - The recipient address where lovelace will be sent.
     * @param {number} [params.amount=DECIMAL_PLACE] - The amount of lovelace to send (default is DECIMAL_PLACE).
     *
     * @returns {Promise<any>} - An unsigned transaction ready to be signed and submitted.
     *
     * @throws {Error} - Throws if UTxOs are insufficient or wallet address cannot be retrieved.
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
