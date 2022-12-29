// import BSV from 'bsv-wallet';
const { Wallet } = require('bsv-wallet');

export const CreateAccountData = async () => {
  const wallet = new Wallet();

  const getMnemonicKey = wallet.getPrivateKey();
  const getAddress = await wallet.getAddress();
  const getBalance = await wallet.getBalance();
  const getNetwork = wallet.masterHDPrivateKey.network.alias;
  // const privateKey = wallet.masterHDPrivateKey.xprivkey;

  return { getMnemonicKey, getAddress, getBalance, getNetwork };
};

export const ImportAccountData = async (mnemonicKey) => {
  const wallet = new Wallet({ key: mnemonicKey });

  const getAddress = await wallet.getAddress();
  const getBalance = await wallet.getBalance();
  const getNetwork = wallet.masterHDPrivateKey.network.alias;

  return { getAddress, getBalance, getNetwork };
};

// export const GetAddress = async () => await wallet.getAddress();

// export const GetBalance = async () => await wallet.getBalance();

// send bsv to an address
// export const SendBSV = async (toAddress, amount, feeRate) => await wallet.send(toAddress, amount, feeRate);
