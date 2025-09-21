use aiken/collection/list
use cardano/assets.{lovelace_of}
use cardano/transaction.{Output, OutputReference, Transaction, find_input}
use contract/types.{Contribute, Datum, Disburse, Redeemer}
use contract/utils.{find_output}

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
    let script_input_lovelace = lovelace_of(script_input.output.value)
    let script_outputs =
      list.filter(outputs, fn(output) { output.address == script_address })
    let destination_outputs =
      list.filter(outputs, fn(output) { output.address == destination })

    when redeemer is {
      Contribute { contributor } -> True
      Disburse -> {
        let contributed =
          list.all(
            participants,
            fn((_participant, amount)) { amount > required },
          )
        let destination_output =
          find_output(outputs, script_input_lovelace, destination)

        and {
          contributed,
          destination_output != None,
          list.length(script_outputs) == 0,
          list.length(destination_outputs) == 1,
        }
      }
    }
  }

  else(_) {
    fail
  }
}
