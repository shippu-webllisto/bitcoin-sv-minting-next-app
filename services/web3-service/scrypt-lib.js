// import { bsv } from 'scryptlib';
import { toast } from 'react-toastify';

export const Mint = async () => {
  try {
    const _mint = await mintTxid(address);
    return _mint;
  } catch (error) {
    return toast.error(error.message);
  }
};

export const TransferOwnership = async (address) => {
  try {
    const _transfer = await transferTxid(address);
    return _transfer;
  } catch (error) {
    return toast.error(error.message);
  }
};

export const Burn = async (address) => {
  try {
    const _burn = await meltTxid(address);
    return _burn;
  } catch (error) {
    return toast.error(error.message);
  }
};

export async function TestTX() {
  const URL =
    'https://api.whatsonchain.com/v1/bsv/test/tx/7b9bc5c67c91a3caa4b3212d3a631a4b61e5c660f0369615e6e3a969f6bef4de/hex';

  const response = await axios(URL);
  if (response.status === 200) return await response.data;
}
