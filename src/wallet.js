const bitcore = require('bitcore-lib-cash');
const fetch = require('whatwg-fetch').fetch
function Wallet() {
  console.log('Constructing a wallet reeee.');
  console.log('fetch', fetch);
  console.log('bitcore', bitcore);
};

Wallet.prototype.getBalance = function getBalance() {
  return 'getBalance';
}

Wallet.prototype.getDepositAddress = function getDepositAddress() {
  return 'getDepositAddress';
}

Wallet.prototype.withdraw = function withdraw(address, value) {
  return ['withdraw', address, value].join(' ');
}

Wallet.prototype.getPrivateKey = function getPrivateKey() {
  return 'getPrivateKey';
}

module.exports = Wallet;