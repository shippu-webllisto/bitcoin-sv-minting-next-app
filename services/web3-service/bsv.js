import { Decryption } from '@/helpers/encryptionAndDecryption';

const { Wallet } = require('bsv-wallet');

export const CreateAccountData = async (network) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const wallet = new Wallet({ network: Network });

  const getMnemonicKey = wallet.mnemonic;
  const getAddress = await wallet.getAddress();
  const getBalance = await wallet.getBalance();
  const getNetwork =
    Network === 'livenet' ? wallet.masterHDPrivateKey.network.alias : wallet.masterHDPrivateKey.network.name;

  return { getMnemonicKey, getAddress, getBalance, getNetwork };
};

export const ImportAccountData = async (mnemonicKey, network) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const wallet = new Wallet({ key: mnemonicKey, network: Network });

  const getAddress = await wallet.getAddress();
  const getBalance = await wallet.getBalance();
  const getNetwork =
    Network === 'livenet' ? wallet.masterHDPrivateKey.network.alias : wallet.masterHDPrivateKey.network.name;

  return { getAddress, getBalance, getNetwork };
};

export const SendTranasction = async (mnemonicKey, network, to, amount) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const decryptionMnemonicKey = Decryption(mnemonicKey);

  const wallet = new Wallet({ key: decryptionMnemonicKey, network: Network });

  const transactionId = await wallet.sendMoney({
    to,
    amount,
  });

  return transactionId;
};

// export const GetAddress = async () => await wallet.getAddress();

// export const GetBalance = async () => await wallet.getBalance();

// send bsv to an address
// export const SendBSV = async (toAddress, amount, feeRate) => await wallet.send(toAddress, amount, feeRate);
