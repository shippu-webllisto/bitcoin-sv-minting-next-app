import { useSelector, useDispatch } from 'react-redux';
import { ConnetedWallet } from '@/store/features/wallet-connect';
import { updatedBalance } from '@/services/web3-service/bsv';
import { UpdateAccount } from '@/store/features/add-account/index';

export const useUpdateBalance = () => {
  const dispatch = useDispatch();
  const WalletConnect = useSelector((state) => state.walletConnect);
  const { addAccount } = useSelector((state) => state.addAccount);

  const CurrenWalletUpdate = async (network, mnemonic) => {
    const { getBal } = await updatedBalance(network, mnemonic);

    // updating balance and transcations of addAccount
    const updatedData = addAccount?.map((item) => {
      if (item.mnemonic === mnemonic) {
        return {
          ...item,
          bsvAmount: getBal,
        };
      }
      return item;
    });

    if (getBal && updatedData) {
      dispatch(UpdateAccount(updatedData));
      dispatch(
        ConnetedWallet({
          ...WalletConnect,
          bsvAmount: getBal,
        }),
      );
    }
  };

  return { CurrenWalletUpdate };
};

export default useUpdateBalance;
