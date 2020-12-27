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
        throw new Error('Fetching balance failed. Please, try again later.');
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

Wallet.prototype.withdraw = function withdraw(address, value) {
  return ['withdraw', address, value].join(' ');
}

Wallet.prototype.getPrivateKey = function getPrivateKey() {
  // WIF is wallet import format, converts key which is an arrat of bytes
  // to a string that is easier to store and write down.;
  return this.privateKey.toWIF();
}

module.exports = Wallet;