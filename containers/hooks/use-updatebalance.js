import { useSelector, useDispatch } from 'react-redux';
import { ConnetedWallet } from '@/store/features/wallet-connect';
import { updatedBalance } from '@/services/web3-service/bsv';

export const useUpdateBalance = () => {
  const dispatch = useDispatch();
  const WalletConnect = useSelector((state) => state.walletConnect);

  const CurrenWalletUpdate = async (network, mnemonic) => {
    const { getBal } = await updatedBalance(network, mnemonic);
    dispatch(
      ConnetedWallet({
        ...WalletConnect,
        bsvAmount: getBal,
      }),
    );
  };

  return { CurrenWalletUpdate };
};

export default useUpdateBalance;
