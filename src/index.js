const Wallet = require('./wallet');
let wallet = new Wallet();
if (localStorage.getItem('bchwallet:privateKey') === null) {
  wallet = new Wallet();
  // if no wallet, create wallet class, and call it's getPrivateKey() method
  // and store the returned private key in localStorage
  localStorage.setItem('bchwallet:privateKey', wallet.getPrivateKey());
} else {
  // if private key if found, pass it in as argument to Wallet class.
  wallet = new Wallet(localStorage.getItem('bchwallet:privateKey'));
}

const balanceDisplay = document.getElementById('balance-display');
const depositAddressDisplay = document.getElementById('deposit-address-display');
const withdrawalForm = document.getElementById('withdrawal-form');
const withdrawalAddress = document.getElementsByName('withdrawal-address').item(0);
const withdrawalAmount = document.getElementsByName('withdrawal-amount').item(0);
const importForm = document.getElementById('import-form');
const privateKey = document.getElementsByName('private-key').item(0);
const exportButton = document.getElementById('export-button');
const privateKeyDisplay = document.getElementById('private-key-display');

const handleError = err => {
  alert(err.message || err.title || 'Unexpected error.');
};

wallet.getBalance().then(balance => {
  balanceDisplay.innerText = balance;
}).catch(handleError);

depositAddressDisplay.innerText = wallet.getDepositAddress();

withdrawalForm.addEventListener('submit', e => {
  e.preventDefault();
  const withdrawalAddressValue = withdrawalAddress.value.trim();
  const withdrawalAmountValue = +withdrawalAmount.value;
  wallet.withdraw(withdrawalAddressValue, withdrawalAmountValue).then(
    txId => {
      alert(`Transaction ID: ${txId}`);
      window.location.reload();
    }
  ).catch(handleError);
});

importForm.addEventListener('submit', e => {
  // on submitting the form, save entered privateKey into local storage and reload page
  e.preventDefault();
  // trim any accidental white space from copy/pasted keys
  const privateKeyValue = privateKey.value.trim();
  localStorage.setItem('bchwallet:privateKey', privateKeyValue);
  privateKey.value = '';
  window.location.reload();
});

exportButton.addEventListener('click', () => {
  if (privateKeyDisplay.innerText === '(hidden)') {
    privateKeyDisplay.innerText = wallet.getPrivateKey();
  } else {
    privateKeyDisplay.innerText = '(hidden)';
  }
});
