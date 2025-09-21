use aiken/collection/list
use cardano/assets.{AssetName, PolicyId, flatten, lovelace_of, without_lovelace}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
}
use contract/types.{Contribute, Datum, Disburse, Redeemer}

validator pact {
  spend(
    datum_option: Option<Datum>,
    redeemer: Redeemer,
    output_reference: OutputReference,
    transaction: Transaction,
  ) {
    expect Some(Datum { participants, destination, required }) = datum_option
    let Transaction { inputs, outputs, extra_signatories, .. } = transaction
    expect Some(script_input) = find_input(inputs, output_reference)
    let script_address = script_input.output.address
    let script_lovelace =
      script_input.output.value
        |> without_lovelace()

    when redeemer is {
      Contribute { contributor } -> True
      Disburse -> True
    }
    // {
    //   let contributed =
    //     list.all(
    //       participants,
    //       fn((_participant, amount)) { amount > required },
    //     )
    // }
  }

  else(_) {
    fail
  }
}
