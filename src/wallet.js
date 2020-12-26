const bitcore = require('bitcore-lib-cash');
const fetch = require('whatwg-fetch').fetch
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
  return 'getBalance';
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