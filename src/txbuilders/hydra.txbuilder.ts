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
    contribute = async ({
        destination,
        required = 10,
        quantity = 1,
    }: {
        destination?: string;
        required?: number;
        quantity?: number;
    }) => {
        await this.hydraProvider.connect();
        const { utxos, collateral, walletAddress } = await this.getWalletForHydraTx();
        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;

        const utxoContract = (await this.hydraProvider.fetchAddressUTxOs(this.spendAddress))[0];
        const utxoInput = this.getUTxOOnlyLovelace({
            utxos: utxos,
            quantity: quantity * DECIMAL_PLACE,
        });
        const unsignedTx = this.meshTxBuilder;
        if (utxoContract) {
            const datum = this.convertDatum({
                plutusData: utxoContract.output.plutusData as string,
            });
            unsignedTx
                .txIn(utxoInput.input.txHash, utxoInput.input.outputIndex)
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
                        datum.required,
                    ]),
                )
                .txOut(this.spendAddress, [
                    {
                        unit: "lovelace",
                        quantity: String(quantity * DECIMAL_PLACE),
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
                        datum.required,
                    ]),
                )
                .txOut(walletAddress, [
                    {
                        unit: "lovelace",
                        quantity: String(Number(utxoInput.output.amount[0].quantity) - quantity * DECIMAL_PLACE),
                    },
                ]);
        } else {
            const participants = await this.getParticipantsForHydraTx();
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
                )
                .txOut(walletAddress, [
                    {
                        unit: "lovelace",
                        quantity: String(Number(utxoInput.output.amount[0].quantity) - quantity * DECIMAL_PLACE),
                    },
                ]);
        }
        unsignedTx
            .changeAddress(walletAddress)
            .selectUtxosFrom(utxos)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .setFee(String(0))
            .setNetwork(APP_NETWORK);

        return await unsignedTx.complete();
    };

    /**
     * @description Disburse previously locked lovelace from the Hydra contract.
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
    disburse = async () => {
        await this.hydraProvider.connect();
        const { utxos, collateral, walletAddress } = await this.getWalletForHydraTx();
        const pubKeyHash = deserializeAddress(walletAddress).pubKeyHash;
        const utxoContract = (await this.hydraProvider.fetchAddressUTxOs(this.spendAddress))[0];

        const participants = this.convertDatum({ plutusData: utxoContract.output.plutusData as string });
        console.log(participants);

        const unsignedTx = this.meshTxBuilder

            .spendingPlutusScriptV3()
            .txIn(utxoContract.input.txHash, utxoContract.input.outputIndex)
            .txInInlineDatumPresent()
            .txInRedeemerValue(mConStr1([]))
            .txInScript(this.spendScriptCbor)
            .txOut(walletAddress, utxoContract.output.amount)
            .txInCollateral(
                collateral.input.txHash,
                collateral.input.outputIndex,
                collateral.output.amount,
                collateral.output.address,
            )
            .requiredSignerHash(pubKeyHash)
            .changeAddress(walletAddress)
            .setNetwork(APP_NETWORK)
            .selectUtxosFrom(utxos)
            .setFee(String(0));

        return await unsignedTx.complete();
    };
}
