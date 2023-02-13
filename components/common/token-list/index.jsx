import React, { useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Styles from './token-list.module.css';
import Addtoken from '@/components/ui/add-token/index';
import { Modal } from 'flowbite-react';
import QRCodeGenerater from '../qr-generate/index';
import PopupModal from '@/components/ui/popup-modal/index';
import { UpdateToken } from '@/store/features/tokens/index';
import { toast } from 'react-toastify';
// import { satoshiToBsvConversion } from '@/helpers/amountConversion';
// import { bsvToUsd } from '@/utils/bsvToUsd';

const TokenList = () => {
  const { walletAddress } = useSelector((state) => state.walletConnect);
  const { tokens } = useSelector((state) => state.tokens);
  const [popup, setPopup] = useState(false);

  const handleAddToken = () => {
    setPopup((prev) => !prev);
  };

  return (
    <>
      <div className={`flex justify-center my-2 ${Styles.token_list}`}>
        <div className="rounded-xl shadow-lg bg-white w-full">
          <div className="flex flex-row justify-between bg-[#527195] text-white font-bold p-1 rounded-t-xl ">
            <h1 className="ml-2">Tokens</h1>
            <button className="flex flex-row justify-center cursor-pointer" onClick={handleAddToken}>
              Add-Token
              <Image
                className="rounded-full mx-2 cursor-pointer mt-0.5"
                src="/assets/svgs/add-icon.svg"
                alt="add-token-logo"
                title="add-token"
                width={20}
                height={20}
                priority
              />
            </button>
          </div>

          {/* tokens list  */}
          <div className="p-6">
            {tokens?.length === 0 ? (
              <h6 className="text-center text-gray-500">Empty</h6>
            ) : (
              tokens?.map((item, i) => {
                return (
                  <React.Fragment key={i}>
                    <Tokens item={item} />
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* add tokens - modal */}
      <Addtoken walletAddress={walletAddress} popup={popup} onClose={() => setPopup(false)} />
    </>
  );
};

const emptyForm = {
  to: '',
};
export function Tokens({ item }) {
  const { tokens } = useSelector((state) => state.tokens);
  const dispatch = useDispatch();

  const [isModalShow, setIsModalShow] = useState(false);
  const [isModalSend, setIsModalSend] = useState(false);
  const [isModalDeleted, setIsModalDeleted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenData, setTokenData] = useState(emptyForm);
  // const [usd, setUsd] = useState(0);

  //  useEffect(() => {
  //    (async () => {
  //      const usdPrice = await bsvToUsd(satoshiToBsvConversion(item.amount));
  //      setUsd(usdPrice);
  //    })();
  //  }, [item.amount]);

  const onChange = (e) => {
    setTokenData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDelteModal = () => {
    setIsModalDeleted((prev) => !prev);
  };

  const handleDelteToken = (codehash) => {
    const updatedData = tokens?.filter((el) => el.codehash !== codehash);
    if (updatedData) {
      dispatch(UpdateToken(updatedData));
      setIsModalDeleted(false);
    }
  };

  const handleQRButton = () => {
    setIsModalShow((prev) => !prev);
  };

  const handleSendToken = () => {
    setIsModalSend((prev) => !prev);
  };

  const handleOpen = () => {
    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setOpen((prev) => !prev);
  };

  const handleSendTokenButton = (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const updatedData = tokens?.filter((el) => el.codehash !== item.codehash);
      if (updatedData) {
        dispatch(UpdateToken(updatedData));
        setIsLoading(false);
        setTokenData(emptyForm);
        setIsModalDeleted(false);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <>
      <div className="bg-gray-200 rounded-lg my-2">
        <div className="flex justify-between p-4">
          <div className="flex flex-row justify-between">
            <Image
              className="rounded-full"
              src={item?.img}
              alt="token-logo"
              title="token"
              width={40}
              height={40}
              priority
            />
            <h2 className="text-center font-mono font-bold mt-4 ml-2">{item?.name}</h2>
          </div>
          <div className="text-lg text-bold flex flex-row justify-between">
            <div className="flex flex-col text-end mx-2">
              <p className="">0</p>
              <p className="">$ {0?.toFixed(3)}</p>
            </div>

            {open ? (
              <Image
                className="rounded-full cursor-pointer"
                src="/assets/svgs/arrow-up.svg"
                alt="arrow-up"
                title="arrow-up"
                width={20}
                height={20}
                priority
                onClick={handleOpen}
              />
            ) : (
              <Image
                className="rounded-full cursor-pointer"
                src="/assets/svgs/arrow-down.svg"
                alt="arrow-down"
                title="arrow-down"
                width={20}
                height={20}
                priority
                onClick={handleOpen}
              />
            )}
          </div>
        </div>

        {open && (
          <div
            className={`${Styles.btn_group} flex  gap-4 justify-center px-8 py-2 font-semibold  dark:bg-gray-100 dark:text-gray-800 hover:border-red-600`}
          >
            <button
              type="button"
              title="delete token"
              className={`w-full flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border border-black hover:border-red-600 btn-home ${Styles.btn}`}
              onClick={handleDelteModal}
            >
              <Image className="mr-2" src="/assets/svgs/delete-icon.svg" alt="delete-logo" width={20} height={20} />
              Delete
            </button>
            <button
              type="button"
              title="receive token"
              className={`w-full flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border border-black hover:border-red-600 btn-home ${Styles.btn}`}
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
              title="send token"
              className={`w-full flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border border-black hover:border-red-600 btn-home ${Styles.btn}`}
              onClick={handleSendToken}
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
          </div>
        )}
      </div>

      {/* delete token  */}
      <PopupModal
        popup={isModalDeleted}
        handlePopup={() => setIsModalDeleted(false)}
        title="Delete Token"
        description="are you sure want to delete your current Token?"
        onClick={() => handleDelteToken(item?.codehash)}
      />

      {/* qr code  */}
      <Modal show={isModalShow} size="lg" popup={true} onClose={() => setIsModalShow(false)} className="modals">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 p-6">
            <QRCodeGenerater walletAddress={item?.walletAddress} />
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>

      {/* send token  */}
      <Modal show={isModalSend} size="lg" popup={true} onClose={() => setIsModalSend(false)} className="modals">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6 p-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Send Token</h1>
            </div>
            <form onSubmit={handleSendTokenButton} className="">
              <div className="form-group mb-3">
                <label htmlFor="send_token" className="form-label inline-block mb-2 text-gray-700"></label>
                <input
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="send_token"
                  placeholder="address"
                  onChange={onChange}
                  name="to"
                  value={tokenData?.to}
                  required
                />
              </div>
              <button
                type="submit"
                className="text-center w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                {isLoading ? 'Loading...' : 'Send Token'}
              </button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

Tokens.propTypes = {
  item: PropTypes.object.isRequired,
};

export default TokenList;
