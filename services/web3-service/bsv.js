const { Wallet } = require('bsv-wallet');
import { toast } from 'react-toastify';
const axios = require('axios');

import { Decryption } from '@/helpers/encryptionAndDecryption';
import { bsvToSatoshiConversion } from '@/helpers/amountConversion';

/**
 * @param {network:string}
 * @returns { getMnemonicKey,getAddress, getBalance, getNetwork }
 */
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

/**
 * @param {mnemonicKey:string,network:string}
 * @returns { getAddress, getBalance, getNetwork }
 */
export const ImportAccountData = async (mnemonicKey, network) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const wallet = new Wallet({ key: mnemonicKey, network: Network });

  const getAddress = await wallet.getAddress();
  const getBalance = await wallet.getBalance();
  const getNetwork =
    Network === 'livenet' ? wallet.masterHDPrivateKey.network.alias : wallet.masterHDPrivateKey.network.name;

  return { getAddress, getBalance, getNetwork };
};

/**
 * @param {mnemonicKey:string,network:string,to:string,bsvAmount:BSV}
 * @returns transaction-hash and balance
 */
export const SendTranasction = async (mnemonicKey, network, to, bsvAmount) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const decryptionMnemonicKey = Decryption(mnemonicKey);
  const amount = bsvToSatoshiConversion(Number(bsvAmount));
  try {
    const wallet = new Wallet({ key: decryptionMnemonicKey, network: Network });
    const getBalance = await wallet.getBalance();

    const transactionId = await wallet.signTx({
      to: to,
      amount: amount,
    });
    const txHash = await wallet.broadcast(transactionId);

    if (txHash && getBalance) {
      return { txHash, getBalance };
    }
  } catch (err) {
    return toast.error(err.message);
  }
};

/**
 * @param {network:string,mnemonicKey:string}
 * @returns {balance}
 */
export const updatedBalance = async (network, mnemonicKey) => {
  const Network = network === 'mainnet' ? 'livenet' : 'testnet';
  const decryptionMnemonicKey = Decryption(mnemonicKey);

  const wallet = new Wallet({ key: decryptionMnemonicKey, network: Network });
  const getBal = await wallet.getBalance();

  return { getBal };
};

// send bsv to an address
// export const SendBSV = async (toAddress, amount, feeRate) => await wallet.send(toAddress, amount, feeRate);

/**
 * @param {address:string,page_size:number}
 * @returns all transaction-list
 */
export async function getTransactionHistory(address, page_size = 3) {
  const URL = `https://blockcheck.info/apiv1/address/tx-history?address=${address}&current=1&page_size=${page_size}`;

  const response = await axios(URL);
  if (response.status === 200) return await response?.data?.list;
}

/**
 * @param {txHash:string} transaction-hash
 * @returns transaction-data
 */
export async function getTransactionData(txHash) {
  const URL = `https://blockcheck.info/apiv1/tx/detail?txid=${txHash}`;

  const response = await axios(URL);
  if (response.status === 200) return await response?.data?.data;
}

/**
 * @param {transactionHash:string} transaction-hash
 * @returns transaction-data and status
 */
export async function toCheckTransaction(txHash) {
  const getTransaction = await getTransactionData(txHash);
  if (getTransaction?.confirmations) {
    return { getTransaction, status: 'confirmed' };
  } else {
    return { getTransaction, status: 'pending' };
  }
}
