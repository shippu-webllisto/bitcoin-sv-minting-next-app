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
