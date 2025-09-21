use aiken/collection/list
use cardano/address.{Address}
use cardano/assets.{AssetName, PolicyId, flatten, lovelace_of, without_lovelace}
use cardano/transaction.{
  InlineDatum, Output, OutputReference, Transaction, find_input,
}

// find output with lovelace and address
pub fn find_output(
  outputs: List<Output>,
  price: Int,
  address: Address,
) -> Option<Output> {
  list.find(
    outputs,
    fn(output) {
      lovelace_of(output.value) >= price && output.address.payment_credential == address.payment_credential
    },
  )
}
