use aiken/crypto.{VerificationKeyHash}
use cardano/address.{Address}

pub type Datum {
  participants: List<(Address, Int)>,
  destination: Address,
  required: Int,
}

pub type Redeemer {
  Contribute { contributor: VerificationKeyHash }
  Disburse
}
