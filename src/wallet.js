const bitcore = require('bitcore-lib-cash');
const fetch = require('whatwg-fetch').fetch
function Wallet() {
  console.log('Constructing a wallet.');
  console.log('fetch', fetch);
  console.log('bitcore', bitcore);
};

module.exports = Wallet;