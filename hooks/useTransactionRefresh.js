import { useSelector, useDispatch } from 'react-redux';
import { toCheckTransaction } from '@/services/web3-service/bsv';
import { ConnetedWallet } from '@/store/features/wallet-connect/index';
import { UpdateAccount } from '@/store/features/add-account/index';

export const useTransactionRefresh = () => {
  const { addAccount } = useSelector((state) => state.addAccount);
  const WalletConnect = useSelector((state) => state.walletConnect);
  const dispatch = useDispatch();

  async function transcationUpdated(walletAddress) {
    // updating transcations of connect-wallet
    const CurrentWallet = await Promise.all(
      WalletConnect.transcations?.map(async (item) => {
        const { getTransaction, status } = await toCheckTransaction(item?.transactionHash);
        if (status === 'confirmed') {
          const obj = {
            status: status,
            transactionHash: item?.transactionHash,
            block: getTransaction?.blockheight,
            feePaid: getTransaction?.fee_paid,
            size: getTransaction?.size,
            time: getTransaction?.time,
            miner: getTransaction?.miner,
          };
          return { ...item, ...obj };
        }
        return item;
      }),
    );

    // updating transaction in addAccount
    const Data = await addAccount?.find((item) => item?.walletAddress === walletAddress);
    if (Data) {
      const AccountUpdate = await Promise.all(
        Data?.transcations?.map(async (el) => {
          const { getTransaction, status } = await toCheckTransaction(el?.transactionHash);
          if (status === 'confirmed') {
            return {
              ...el,
              transactionHash: el?.transactionHash,
              status: status,
              block: getTransaction?.blockheight,
              feePaid: getTransaction?.fee_paid,
              size: getTransaction?.size,
              time: getTransaction?.time,
              miner: getTransaction?.miner,
            };
          }
          return el;
        }),
      );
      const updateAccounts = addAccount?.map((item) => {
        if (item?.walletAddress === walletAddress) {
          return { ...item, transcations: AccountUpdate };
        }
        return item;
      });

      if (CurrentWallet && updateAccounts) {
        dispatch(ConnetedWallet({ ...WalletConnect, transcations: CurrentWallet }));
        dispatch(UpdateAccount(updateAccounts));
      }
    }
  }

  return { transcationUpdated };
};
