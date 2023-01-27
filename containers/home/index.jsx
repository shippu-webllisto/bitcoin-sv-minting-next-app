import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { Modal } from 'flowbite-react';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import Styles from './home.module.css';
import QRCodeGenerater from '@/components/common/qr-generate/index.jsx';
import CopyClipBoard from '@/components/common/copy-clip-board/index.jsx';
import SendBsv from '@/components/common/send-bsv/index.jsx';
import NftList from '@/components/common/nft-list/index.jsx';
import TokenList from '@/components/common/token-list/index.jsx';
import { bsvToUsd } from '@/utils/bsvToUsd';
import { satoshiToBsvConversion } from '@/helpers/amountConversion';
import useUpdateBalance from '../hooks/use-updatebalance';
import Spinner_ from '@/components/ui/spinner_/index';
import AccountDropDown from '@/components/ui/accounts-dropdown/index.jsx';
// const AccountDropDown = dynamic(() => import('@/components/ui/accounts-dropdown/index.jsx'), { suspense: true });
const TranscationsHistory = dynamic(() => import('@/components/common/transactions-history/index'), { suspense: true });

const Home = () => {
  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalSend, setisModalSend] = useState(false);
  const { walletAddress, bsvAmount, network, mnemonic } = useSelector((state) => state.walletConnect);

  const { CurrenWalletUpdate } = useUpdateBalance();
  const [usd, setUsd] = useState(0);

  useEffect(() => {
    CurrenWalletUpdate(network, mnemonic);
  }, []);

  useEffect(() => {
    (async () => {
      const usdPrice = await bsvToUsd(satoshiToBsvConversion(bsvAmount));
      setUsd(usdPrice);
    })();
  }, [bsvAmount]);

  const handleQRButton = () => {
    setIsModalShow((prev) => !prev);
  };

  const handleSendBsv = () => {
    setisModalSend((prev) => !prev);
  };

  return (
    <div className="flex justify-center flex-col items-center">
      {/* multiple accounts  */}
      {/* <Suspense fallback={<Spinner_ />}> */}
      <AccountDropDown />
      {/* </Suspense> */}

      {/* balance and acount  */}
      <div className={`flex justify-center rounded overflow-hidden ${Styles.home_page}`}>
        <div className="block rounded-xl w-full bg-white shadow border p-4">
          <div className="flex justify-between w-full bg-gray-300 hover:bg-gray-400 rounded-lg p-4">
            <Image
              className="rounded-full text-center"
              src="/assets/images/Bsv-icon-small.png"
              alt="bsv-logo"
              width={60}
              height={60}
              priority
            />
            <div className="text-end text-lg text-bold">
              <h1 className="">
                {satoshiToBsvConversion(bsvAmount)?.toFixed(6)} <span>BSV</span>
              </h1>
              <p>
                $ {usd?.toFixed(3)} <span>USD</span>
              </p>
            </div>
          </div>

          {/* copy clipboard  */}
          <CopyClipBoard walletAddress={walletAddress} />

          {/* button group  */}
          <div className="w-full flex justify-center my-4 mx-2">
            <div
              className={`${Styles.home_btn} flex  gap-4 justify-center px-8 py-2 font-semibold  dark:bg-gray-100 dark:text-gray-800 hover:border-red-600`}
            >
              <button
                type="button"
                title="receive bsv"
                className={`flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border hover:border-red-600 btn-home ${Styles.btn_home}`}
                onClick={handleQRButton}
              >
                <Image
                  className="mr-2"
                  src="/assets/svgs/icon-qrcode.6dcd8c7a.svg"
                  alt="qr-logo"
                  width={20}
                  height={20}
                />
                Receive
              </button>

              <button
                type="button"
                title="send bsv"
                className={`flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border hover:border-red-600 btn-home ${Styles.btn_home}`}
                onClick={handleSendBsv}
              >
                <Image
                  className="mr-2"
                  src="/assets/svgs/icon-transfer.2a3315af.svg"
                  alt="transfer-logo"
                  width={20}
                  height={20}
                />
                Send
              </button>

              <a
                href={`https://blockcheck.info/address/detail?address=${walletAddress}`}
                target="_blank"
                type="button"
                title="check history"
                className={`flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border hover:border-red-600 btn-home ${Styles.btn_home}`}
                rel="noreferrer"
              >
                <Image
                  className="mr-2"
                  src="/assets/svgs/icon-history.e9221d94.svg"
                  alt="history-logo"
                  width={20}
                  height={20}
                />
                History
              </a>
            </div>

            {/* receive modal  */}
            <Modal show={isModalShow} size="md" popup={true} onClose={() => setIsModalShow((prev) => !prev)}>
              <Modal.Header />
              <Modal.Body>
                <div className="space-y-6 p-6">
                  <QRCodeGenerater walletAddress={walletAddress} />
                </div>
              </Modal.Body>
              <Modal.Footer />
            </Modal>
            {/* send modal  */}
            <Modal show={isModalSend} size="lg" popup={true} onClose={() => setisModalSend((prev) => !prev)}>
              <Modal.Body>
                <div className="space-y-6 p-6">
                  <SendBsv walletAddress={walletAddress} setSendBsvPopup={() => setisModalSend(false)} />
                </div>
              </Modal.Body>
              <Modal.Footer />
            </Modal>
          </div>
        </div>
      </div>

      {/* tokens list  */}
      <TokenList />

      {/* nfts list  */}
      <NftList />

      {/* Transcations History */}
      <Suspense fallback={<Spinner_ />}>
        <TranscationsHistory />
      </Suspense>
    </div>
  );
};

export default Home;
