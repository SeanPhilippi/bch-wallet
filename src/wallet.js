const bitcore = require('bitcore-lib-cash');
const fetch = require('whatwg-fetch').fetch;

function Wallet(privateKey) {
  if (privateKey) {
    // WIF = wallet import format
    this.privateKey = bitcore.PrivateKey.fromWIF(privateKey);
  } else {
    // create a completely random private key
    this.privateKey = new bitcore.PrivateKey();
  }
};

Wallet.prototype.getBalance = function getBalance() {
  return fetch(`https://rest.bitcoin.com/v2/address/details/${this.getDepositAddress()}`).then(
    res => {
      if (!res.ok) {
        throw new Error('Fetching balance failed. Please try again later.');
      }
      return res.json();
    }
  ).then(details => {
    console.log('details', details)
    // balanceSat is balance displayed in satoshis
    // adding unconfirmedBalanceSat because the balance value is just what has made it
    // into the blockchain because the blocks have been mined by miners adding
    // unconfirmedBalanceSat will give you what the real total will be once it's all on the blockchain
    return details.balanceSat + details.unconfirmedBalanceSat;
  });
}

Wallet.prototype.getDepositAddress = function getDepositAddress() {
  // public key is derived from the private key, and an address is just a
  // has of the user's private key
  return this.privateKey.toPublicKey().toAddress().toString();
}

Wallet.prototype.withdraw = function withdraw(address, amount) {
  // store this value here as self, since in the then() the
  // this value will no longer reference the Wallet
  const self = this;
  return fetch(`https://rest.bitcoin.com/v2/address/utxo/${this.getDepositAddress()}`).then(res => {
    if (!res.ok) {
      throw new Error('Fetching UTXOs failed. Please try again later.');
    }
    return res.json();
  }).then(res => {
    console.log('utxos', res.utxos)
    // balance is the sum of all the satoshis in our utxos
    // utxo = unspent transaction output
    const balance = res.utxos.reduce((acc, utxo) => acc + utxo.satoshis, 0);
    console.log('balance', balance)
    let minerFee = 250; // make adjustable later
    const transaction = new bitcore.Transaction()
      .from(res.utxos)
      .to(address, amount)
      .to(self.getDepositAddress(), balance - amount - minerFee)
      .sign(self.privateKey);
    // grabs transaction object and produces a raw transaction from it
    // checks that it's been signed, etc, if not, it will fail
    const rawTransaction = tranaction.checkedSerialize();
    return fetch(`https://rest.bitcoin.com/v2/rawtransactions/sendRawTransaction/${rawTransaction}`, {
      method: 'POST',
    })
  }).then(res => {
    if (!res.ok) {
      throw new Error('Broadcasting tranaction failed. Please try again later.');
    }
    return res.text();
  }).then(text => {
    // test whether the text contains a valid transaction id
    if (text.match(/^"[0-9a-fA-F]{64}"$/) === null) {
      throw new Error(`Broadcasting transaction failed with error: ${text}. Please try again.`);
    }
  })
}

Wallet.prototype.getPrivateKey = function getPrivateKey() {
  // WIF is wallet import format, converts key which is an arrat of bytes
  // to a string that is easier to store and write down.;
  return this.privateKey.toWIF();
}

module.exports = Wallet;