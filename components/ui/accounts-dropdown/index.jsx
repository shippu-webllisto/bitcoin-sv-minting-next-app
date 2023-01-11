import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Button, Modal } from 'flowbite-react';

import { getShortAddress } from '@/utils/getShortAddress.js';
import { endpoints } from '@/routes/endpoints';
import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { AddAccount } from '@/store/features/add-account/index';
import { ConnetedWallet } from '@/store/features/wallet-connect/index';
import { CreateAccountData } from '@/services/web3-service/bsv';
import { Encryption } from '@/helpers/encryptionAndDecryption';
import ImportAccountModal from '../input-popup-modal/index';

// import avatar from '@/assets/svgs/user-avatar.svg';
const avatar = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg';

const AccountDropDown = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { addAccount } = useSelector((state) => state.addAccount);
  const WalletConnect = useSelector((state) => state.walletConnect);

  const [open, setOpen] = useState(false);
  const [popup, setPopup] = useState(false);

  const [generatePopup, setGeneratePopup] = useState(false);
  const [mnemonicKey, setMnemonicKey] = useState('');

  const [popupImportModal, setPopupImportModal] = useState(false);

  const [mnemonicKeyArray, setMnemonicKeyArray] = useState([]);
  const [sequenceMnemonicKey, setSequenceMnemonicKey] = useState([]);
  const [isMnemonicVerifyBtn, setMnemonicVerifyBtn] = useState(false);
  const [mnemonicVerifyModel, setMnemonicVerifyModel] = useState(false);
  const [isMatchIndex, setMatchIndex] = useState([]);

  const handleOpenAccount = () => {
    setOpen((prev) => !prev);
  };

  const handleCreateNewAccountModal = () => {
    setPopup((prev) => !prev);
  };

  //! create a new Account
  const handleCreateOpenModal = async () => {
    // generating mnemonic key
    const { getMnemonicKey } = await CreateAccountData(WalletConnect.network);
    if (!checkEmptyValue(getMnemonicKey)) {
      setMnemonicKey(getMnemonicKey);

      const Mnemonic_split_string = getMnemonicKey?.split(' ');
      setMnemonicKeyArray(Mnemonic_split_string);
      setMatchIndex(Mnemonic_split_string);

      setPopup(false);
      setMnemonicVerifyModel(true);
    }
  };

  //update setSequenceMnemonicKey Array
  const handleSeqenceKeys = (e, val, index) => {
    e.stopPropagation();

    setSequenceMnemonicKey((oldItem) => [...oldItem, val]);

    setMnemonicKeyArray([
      ...mnemonicKeyArray.slice(0, index),
      ...mnemonicKeyArray.slice(index + 1, mnemonicKeyArray.length),
    ]);
  };

  // for remove keys
  const removeMnemonicKey = (e, val, index) => {
    e.stopPropagation();

    setSequenceMnemonicKey([
      ...sequenceMnemonicKey.slice(0, index),
      ...sequenceMnemonicKey.slice(index + 1, sequenceMnemonicKey.length),
    ]);
    setMnemonicKeyArray((oldItem) => [...oldItem, val]);
  };

  //for random  keys

  function randomize(values) {
    let index = values.length,
      randomIndex;
    // While there remain elements to shuffle.
    while (index != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * index);
      index--;
      // And swap it with the current element.
      [values[index], values[randomIndex]] = [values[randomIndex], values[index]];
    }

    setMnemonicKeyArray(values);
  }

  //handle modal state
  const handleModalState = async (e) => {
    e.stopPropagation();
    setMnemonicVerifyModel(false);
    const Mnemonic_split_string = mnemonicKey?.split(' ');
    await randomize(Mnemonic_split_string);

    setGeneratePopup(true);
  };

  // check btn  disabled
  const handleBtnState = () => {
    if (sequenceMnemonicKey?.length > 10) {
      if (JSON.stringify(isMatchIndex) === JSON.stringify(sequenceMnemonicKey)) {
        setMnemonicVerifyBtn(true);
      } else {
        setMnemonicVerifyBtn(false);
      }
    }
  };

  useEffect(() => {
    handleBtnState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sequenceMnemonicKey]);

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const encryptedMnemonicKey = Encryption(mnemonicKey);
      const { getAddress, getBalance, getNetwork } = await CreateAccountData(WalletConnect.network);
      if (
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(mnemonicKey) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork) &&
        !checkEmptyValue(encryptedMnemonicKey)
      ) {
        const count = addAccount.length + 1;

        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: encryptedMnemonicKey,
            testnetPrivateKey: '',
            mainnetPrivateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: `Account-${count}`,
          }),
        );
        dispatch(
          ConnetedWallet({
            walletAddress: getAddress,
            mnemonic: encryptedMnemonicKey,
            testnetPrivateKey: '',
            mainnetPrivateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: `Account-${count}`,
          }),
        );
        // close popup and clear input

        setGeneratePopup(false);

        setSequenceMnemonicKey([]);
        setMnemonicVerifyBtn(false);
        return router.push(endpoints.home);
      }
    } catch (error) {
      setGeneratePopup(false);

      setSequenceMnemonicKey([]);
      setMnemonicVerifyBtn(false);
      return toast.error(error.message);
    }
  };

  //  For  Close Modal
  const handlemodallClose = () => {
    setGeneratePopup(false);
    setSequenceMnemonicKey([]);
    setMnemonicVerifyBtn(false);
  };

  //! adding a exist account (import account)
  const handleRestoreMnemonicModal = () => {
    setPopupImportModal((prev) => !prev);
  };

  const handleSeletcedAccount = (item) => {
    dispatch(ConnetedWallet(item));
  };

  return (
    <>
      <div className="inline-flex text-center bg-white my-1 justify-center ">
        <div className="relative">
          <div className="flex bg-[#f5f7fa] hover:border-black border-2  rounded-full my-2 px-10 p-3 m-3 align-middle">
            <button
              className="flex justify-between px-6 text-sm text-gray-400 w-full"
              onClick={(e) => handleOpenAccount(e)}
            >
              <Image
                className="rounded-full mt-2"
                src={WalletConnect?.avatar || '/assets/svgs/user.svg'}
                alt="logo"
                width={40}
                height={40}
              />
              <div className="flex flex-col justify-end mx-4 text-black">
                <span className="font-bold text-lg">{WalletConnect?.account}</span>
                <span className="font-mono">{getShortAddress(WalletConnect?.walletAddress)}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mt-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {open && (
            <div
              className="absolute z-10 w-full origin-top-right rounded-md border border-gray-100 bg-white shadow-lg"
              role="menu"
            >
              <div className="p-2 rounded-lg">
                <div className="text-end">
                  <button className="" onClick={() => setOpen(false)}>
                    <Image src="/assets/images/cross-23.png" alt="cross-icon" width={15} height={15} />
                  </button>
                </div>
                {addAccount?.map((item, i) => {
                  return (
                    <div key={i} className="hover:bg-gray-200">
                      <button
                        className="flex justify-between px-6 text-sm text-gray-600 text-center my-2 "
                        onClick={() => handleSeletcedAccount(item)}
                      >
                        <Image
                          className="rounded-full mx-auto w-10 ml-0 border text-center mt-2"
                          src={item?.avatar}
                          alt="logo"
                          width={30}
                          height={30}
                        />
                        <div className="flex flex-col mx-8 text-black mt-2">
                          <span className="font-bold text-sm">{item?.account}</span>
                          <span className="font-mono">{getShortAddress(item?.walletAddress)}</span>
                        </div>
                        {item?.walletAddress === WalletConnect?.walletAddress && (
                          <Image
                            className="rounded-full mt-4"
                            src="/assets/svgs/check-symbol.svg"
                            alt="logo"
                            width={20}
                            height={20}
                          />
                        )}
                      </button>
                      <hr />
                    </div>
                  );
                })}
                <br />
                <button
                  type="button"
                  className="rounded-lg px-4 py-2 text-sm text-black hover:bg-gray-300 bg-gray-200 hover:text-gray-700"
                  onClick={handleCreateNewAccountModal}
                >
                  Add New Account...
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* buttons modal   */}
      <Modal show={popup} size="md" popup={true} onClose={() => setPopup(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="item-center flex flex-col justify-center">
            <Button
              gradientDuoTone="purpleToBlue"
              className="my-2"
              onClick={(e) => {
                handleCreateOpenModal(e);
              }}
            >
              Create New Mnemonic(12-Words) Account
            </Button>
            <Button gradientDuoTone="purpleToPink" className="my-2" onClick={handleRestoreMnemonicModal}>
              Restore from Mnemonic
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      {/* create your Account - modal  */}

      <Modal show={mnemonicVerifyModel} size="md" popup={true} onClose={() => setMnemonicVerifyModel(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-3xl font-bold text-gray-900 dark:text-gray-400">Create an Account</h3>
            <p className="mb-5 text-base  font-normal text-gray-500 dark:text-gray-400">
              Your Secret Recovery Phrase makes it easy to back up and restore your account.
            </p>

            <p className="mb-5 text-base  font-normal mt-1 text-gray-500 dark:text-gray-400">
              WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether forever.
            </p>

            <div className="flex flex-col gap-4 my-4">
              <div className="bg-gray-100  grid grid-cols-2">
                {isMatchIndex?.map((val, i) => {
                  return (
                    <button className="bg-blue-900 text-white px-4 hover:bg-blue-900 rounded-lg p-1 m-1  " key={i}>
                      {i + 1}. {val}
                    </button>
                  );
                })}
              </div>

              <Button type="submit" gradientDuoTone="purpleToBlue" onClick={(e) => handleModalState(e)}>
                Next
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* create modal */}
      <Modal show={generatePopup} size="md" popup={true} onClose={() => handlemodallClose()}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center ">
            <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-400"> Confirm your Secret Mnemonic</h3>
            <p className="mb-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              Please select each Mnemonic in order to make sure it is correct.
            </p>

            <div className="  h-4/5  flex flex-col gap-4 my-4">
              <div className=" w-full bg-gray-100 grid grid-cols-2 py-3 mt-8 ">
                {sequenceMnemonicKey?.map((val, i) => {
                  return (
                    <button
                      className=" relative bg-blue-900 text-white px-4 hover:bg-blue-900 rounded-full p-1 m-1  "
                      key={i}
                    >
                      {i + 1}. {val}
                      <span
                        onClick={(e) => removeMnemonicKey(e, val, i)}
                        className="absolute -top-1 -right-1  text-sm border-black leading-4  bg-white rounded-full h-4 w-4 text-black"
                      >
                        X
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className=" w-full bg-gray-100  block py-3 mt-8 ">
                {mnemonicKeyArray?.map((val, i) => {
                  return (
                    <button
                      className="bg-blue-900 text-white px-4 hover:bg-blue-900 rounded-full p-1 m-1 mt-2 "
                      key={i}
                      onClick={(e) => handleSeqenceKeys(e, val, i)}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>

              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                disabled={!isMnemonicVerifyBtn}
                className={`${isMnemonicVerifyBtn ? '' : 'disabled:opacity-30'}`}
                onClick={(e) => handleCreateAccount(e)}
              >
                Yes, Im sure..
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      {/* import your Account - modal  */}
      <ImportAccountModal
        popup={popupImportModal}
        onClose={() => setPopupImportModal(false)}
        title="Import an Account !"
        description="add your mnemonic key here below down!"
      />
    </>
  );
};

export default AccountDropDown;
