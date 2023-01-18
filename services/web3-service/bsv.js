const { Wallet } = require('bsv-wallet');
import { toast } from 'react-toastify';

import { Decryption } from '@/helpers/encryptionAndDecryption';
import { bsvToSatoshiConversion } from '@/helpers/amountConversion';
import { checkEmptyValue } from '@/utils/checkEmptyValue';

export const CreateAccountData = async (network) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const wallet = new Wallet({ network: Network });

  const getMnemonicKey = wallet.mnemonic;
  const getAddress = await wallet.getAddress();
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

export const SendTranasction = async (mnemonicKey, network, to, bsvAmount) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const decryptionMnemonicKey = Decryption(mnemonicKey);
  const amount = bsvToSatoshiConversion(Number(bsvAmount));
  try {
    const wallet = new Wallet({ key: decryptionMnemonicKey, network: Network });

    const transactionId = await wallet.signTx({
      to: to,
      amount: amount,
    });
    const tx = await wallet.broadcast(transactionId);
    if (!checkEmptyValue(tx)) {
      const getBalance = await wallet.getBalance();
      // const balance = satoshiToBsvConversion(getBalance);
      // console.log({ balance });

      return { tx, getBalance };
    }
  } catch (err) {
    return toast.error(err.message);
  }
};

// send bsv to an address
// export const SendBSV = async (toAddress, amount, feeRate) => await wallet.send(toAddress, amount, feeRate);

export const updatedBalance = async (network, mnemonicKey) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const decryptionMnemonicKey = Decryption(mnemonicKey);

  const wallet = new Wallet({ key: decryptionMnemonicKey, network: Network });
  const getBal = await wallet.getBalance();

  return { getBal };
};
