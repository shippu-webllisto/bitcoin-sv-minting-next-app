import axios from 'axios';
import { config } from '@/config/index';
import { checkEmptyValue } from './checkEmptyValue';

// const coingecko_eth_URL = `${config.coingeckoBaseUrl}v3/simple/price?ids=ethereum&vs_currencies=usd`;
// const SENSILET_URL = 'https://sensilet.com/api/bsv_price?versionCode=17';
const coingecko_URL = `${config.coingeckoBaseUrl}/v3/simple/price?ids=bitcoin-cash-sv&vs_currencies=usd`;

export const getUSDPrice = async (url) => {
  const price = await axios.get(url);
  if (price.status === 200) return await price.data['bitcoin-cash-sv'].usd;
};

export const bsvToUsd = async (bsvAmount) => {
  try {
    const usd = await getUSDPrice(coingecko_URL);

    if (!checkEmptyValue(usd)) {
      const balance = bsvAmount * usd;
      return balance;
    }
  } catch (error) {
    return new Error(error.message);
  }
};
