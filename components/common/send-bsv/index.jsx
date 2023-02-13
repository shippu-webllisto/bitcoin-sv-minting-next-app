import { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

import { checkEmptyValue } from '@/utils/checkEmptyValue.js';
import { SendTranasction, toCheckTransaction } from '@/services/web3-service/bsv';
import { AddTranscation, UpdateBsvBalance } from '@/store/features/wallet-connect/index';
import { UpdateAccount } from '@/store/features/add-account';
import { satoshiToBsvConversion } from '@/helpers/amountConversion';
// import useUpdateBalance from '@/containers/hooks/use-updatebalance';
// import { useTransactionRefresh } from '@/hooks/useTransactionRefresh';

const emptyForm = {
  to: '',
  amount: '',
};

const amountInput = {
  toBalError: '',
};

const SendBsv = ({ walletAddress, setSendBsvPopup }) => {
  // const WalletConnect = useSelector((state) => state.walletConnect);
  const { addAccount } = useSelector((state) => state.addAccount);
  const { network, mnemonic, bsvAmount } = useSelector((state) => state.walletConnect);
  // const { transcationUpdated } = useTransactionRefresh();
  // const { CurrenWalletUpdate } = useUpdateBalance();
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState(amountInput);
  const [loading, setLoading] = useState(false);

  const onChange = async (e) => {
    const { name, value } = e.target;

    if (name === 'amount') {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
      if (+value * 100000000 > bsvAmount) {
        setError({
          ...error,
          toBalError: 'Insufficient balance',
        });
      } else if (+value <= 0) {
        setError({
          ...error,
          toBalError: 'Enter greater than 0',
        });
      } else {
        setError({
          ...error,
          toBalError: '',
        });
      }
    }

    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const closeModalState = () => {
    setLoading(false);
    setSendBsvPopup();
    setFormData({ ...emptyForm });
    setError({ ...amountInput });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (checkEmptyValue(walletAddress) || checkEmptyValue(formData.to) || checkEmptyValue(formData.amount))
      return toast.error('please, fill the all required fileds.');

    if (error?.toBalError) return toast.error(error?.toBalError);
    if (formData.amount > bsvAmount) return toast.error('you does not have a sufficient amount.');
    setLoading(true);
    const { txHash, getBalance } = await SendTranasction(mnemonic, network, formData.to, formData.amount);
    const { getTransaction, status } = await toCheckTransaction(txHash);
    const getBal = satoshiToBsvConversion(getBalance) - Number(formData.amount);

    if (!checkEmptyValue(txHash) && !checkEmptyValue(getBal)) {
      setLoading(true);
      // updating balance and transcations of addAccount
      const updatedData = await Promise.all(
        addAccount?.map((item) => {
          if (item.mnemonic === mnemonic) {
            return {
              ...item,
              bsvAmount: getBal,
              transcations: [
                ...item.transcations,
                {
                  status: status,
                  transactionHash: txHash,
                  block: getTransaction?.blockheight,
                  feePaid: getTransaction?.fee_paid,
                  size: getTransaction?.size,
                  time: getTransaction?.time,
                  miner: getTransaction?.miner,
                },
              ],
            };
          }
          return item;
        }),
      );
      dispatch(UpdateAccount(updatedData));
      // updating balance and transcations of connect-wallet
      dispatch(UpdateBsvBalance(getBal));
      dispatch(
        AddTranscation({
          status: status,
          transactionHash: txHash,
          block: getTransaction?.blockheight,
          feePaid: getTransaction?.fee_paid,
          size: getTransaction?.size,
          time: getTransaction?.time,
          miner: getTransaction?.miner,
        }),
      );

      if (status === 'confirmed') {
        toast.success('Transactions Confirmed!');
      } else {
        toast.success('Transactions is Pending!');
      }
      setLoading(true);
      closeModalState();
      // CurrenWalletUpdate(WalletConnect?.network, WalletConnect?.mnemonic);
      router.reload();
    }
  };

  const handleCloseModal = () => {
    setLoading(false);
    setSendBsvPopup();
    setFormData({ ...emptyForm });
    setError({ ...amountInput });
  };

  return (
    <div
      className=" relative flex justify-center flex-col border rounded-lg bg-gray-50"
      style={{ pointerEvents: loading ? 'none' : 'auto' }}
    >
      <div className="absolute top-2 right-2 cursor-pointer font-semibold text-lg" onClick={() => handleCloseModal()}>
        X{' '}
      </div>
      <h1 className="text-center text-2xl font-mono my-2">Send BSV</h1>
      <div className="flex flex-row justify-center">
        <p>
          You are sending <strong>BSV</strong>
        </p>
        <Image
          className="rounded-full ml-2"
          src="/assets/images/Bsv-icon-small.png"
          alt="logo"
          width={24}
          height={20}
        />
      </div>

      <form onSubmit={handleSubmit} className="p-2 m-2 mb-0 bg-gray-100">
        <div className="form-group">
          <label htmlFor="exampleInputEmail2" className="form-label inline-block mb-2 text-gray-700">
            Form
          </label>
          <input
            type="text"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="exampleInputEmail2"
            placeholder="address"
            value={walletAddress}
            disabled
          />
        </div>
        <div className="form-group mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label inline-block mb-2 text-gray-700"></label>
          <input
            type="text"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="exampleInputPassword1"
            placeholder="input address"
            onChange={onChange}
            name="to"
            value={formData?.to}
            required
          />
        </div>
        <div className="form-group mb-6">
          <label htmlFor="exampleInputPassword2" className="form-label inline-block mb-2 text-gray-700"></label>
          <input
            type="number"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="exampleInputPassword2"
            placeholder="input amount (unit:BSV)"
            onChange={onChange}
            name="amount"
            value={formData?.amount}
            required
          />
          <div className="flex justify-between mt-1">
            <span className="text-red-600 text-sm">{error?.toBalError}</span>
            <span className="text-sm"> your current bsv : {satoshiToBsvConversion(bsvAmount)}</span>
          </div>
        </div>

        <button
          type="submit"
          className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          {loading ? 'Loading...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

SendBsv.propTypes = {
  walletAddress: PropTypes.string.isRequired,
  setSendBsvPopup: PropTypes.func,
};

export default SendBsv;
