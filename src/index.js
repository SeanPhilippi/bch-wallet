const Wallet = require('./wallet');
const wallet = new Wallet();

const balanceDisplay = document.getElementById('balance-display');
const depositAddressDisplay = document.getElementById('deposit-address-display');
const withdrawalForm = document.getElementById('withdrawal-form');
const withdrawalAddress = document.getElementsByName('withdrawal-address').item(0);
const withdrawalAmount = document.getElementsByName('withdrawal-amount').item(0);
const importForm = document.getElementById('import-form');
const privateKey = document.getElementsByName('private-key').item(0);
const exportButton = document.getElementById('export-button');
const privateKeyDisplay = document.getElementById('private-key-display');

balanceDisplay.innerText = wallet.getBalance();
console.log('balanceDisplay', balanceDisplay.innerText)

depositAddressDisplay.innerText = wallet.getDepositAddress();

withdrawalForm.addEventListener('submit', e => {
  e.preventDefault();
  const txId = wallet.withdraw(withdrawalAddress.value, withdrawalAmount.value);
  alert(['Transaction ID:', txId].join(' '));
});

importForm.addEventListener('submit', e => {
  e.preventDefault();
  console.log('privateKey', privateKey.value)
});

exportButton.addEventListener('click', () => {
  if (privateKeyDisplay.innerText === '(hidden)') {
    privateKeyDisplay.innerText = wallet.getPrivateKey();
  } else {
    privateKeyDisplay.innerText = '(hidden)';
  }
});
