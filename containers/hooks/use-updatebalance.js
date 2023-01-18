import { Decryption } from '@/helpers/encryptionAndDecryption';
import { ConnetedWallet } from '@/store/features/wallet-connect';
import { useSelector, useDispatch } from 'react-redux';
const { Wallet } = require('bsv-wallet');

export const useUpdateBalance = () => {
  const dispatch = useDispatch();

  const WalletConnect = useSelector((state) => state.walletConnect);

  const CurrenWalletUpdate = async (network, mnemonic) => {
    const { getBal } = await updatedToken(network, mnemonic);
    dispatch(
      ConnetedWallet({
        ...WalletConnect,
        bsvAmount: getBal,
      }),
    );
  };

  const updatedToken = async (network, mnemonicKey) => {
    const Network = network === 'mainnet' ? 'livenet' : 'testnet';
    const decryptionMnemonicKey = Decryption(mnemonicKey);
    const wallet = await new Wallet({ key: decryptionMnemonicKey, network: Network });
    const getBal = await wallet.getBalance();
    return { getBal };
  };

  return {
    CurrenWalletUpdate,
  };
};

export default useUpdateBalance;
