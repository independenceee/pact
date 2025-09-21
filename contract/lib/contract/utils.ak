use aiken/collection/list
use cardano/address.{Address}
use cardano/assets.{lovelace_of}
use cardano/transaction.{Output}

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
