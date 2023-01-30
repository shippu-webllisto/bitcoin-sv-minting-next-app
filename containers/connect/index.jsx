import { useState, useEffect } from 'react';
import { Button, Card, Modal } from 'flowbite-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { endpoints } from '@/routes/endpoints.js';
import { checkEmptyValue } from '@/utils/checkEmptyValue.js';
import { CreateAccountData } from '@/services/web3-service/bsv.js';
import { AddAccount } from '@/store/features/add-account/index';
import { ConnetedWallet } from '@/store/features/wallet-connect/index';
import { Encryption } from '@/helpers/encryptionAndDecryption';
import SignUpPage from '@/components/common/signup/index';
import { AuthenticatedUser } from '@/store/features/authentication/index';
import ImportAccountModal from '@/components/ui/input-popup-modal/index.jsx';
import CopyClipBoard from '@/components/common/copy-clip-board';

// import avatar from '@/assets/svgs/user-avatar.svg';
const avatar = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg';

const Connect = () => {
  const { password } = useSelector((state) => state.authentication);
  const { addAccount } = useSelector((state) => state.addAccount);
  const router = useRouter();
  const dispatch = useDispatch();

  const [generatePopup, setGeneratePopup] = useState(false);
  const [mnemonicKey, setMnemonicKey] = useState('');

  const [popupImportModal, setPopupImportModal] = useState(false);
  const [mnemonicVerifyModel, setMnemonicVerifyModel] = useState(false);

  const [signupModal, setSignupModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [mnemonicKeyArray, setMnemonicKeyArray] = useState([]);

  const [sequenceMnemonicKey, setSequenceMnemonicKey] = useState([]);
  const [isMnemonicVerifyBtn, setMnemonicVerifyBtn] = useState(false);
  const [isMatchIndex, setMatchIndex] = useState([]);

  /**
   *@create a new Account
   */
  const handleCreateOpenModal = async () => {
    // generating mnemonic-key
    const { getMnemonicKey } = await CreateAccountData('mainnet');
    if (!checkEmptyValue(getMnemonicKey)) {
      setMnemonicKey(getMnemonicKey);
      const Mnemonic_split_string = getMnemonicKey?.split(' ');

      setMnemonicKeyArray(Mnemonic_split_string);
      setMatchIndex(Mnemonic_split_string);

      setGeneratePopup((prev) => !prev);
    }
  };

  // check btn  disabled
  const handleBtnState = () => {
    if (sequenceMnemonicKey.length > 5) {
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

  // for update keys
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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const encryptedMnemonicKey = Encryption(mnemonicKey);
      const { getAddress, getBalance, getNetwork } = await CreateAccountData('mainnet');
      if (
        !checkEmptyValue(mnemonicKey) &&
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork) &&
        !checkEmptyValue(encryptedMnemonicKey)
      ) {
        const count = addAccount.length + 1;
        const _account = `Account-${count}`;
        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: encryptedMnemonicKey,
            testnetPrivateKey: '',
            mainnetPrivateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: _account,
            transcations: [],
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
            account: _account,
            transcations: [],
          }),
        );
        // remove auth for a week(7*24*60*60)
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        setTimeout(() => {
          dispatch(AuthenticatedUser({ password: password, auth: false }));
          router.replace(endpoints.login);
        }, oneWeek);

        // close popup and clear input
        setGeneratePopup((prev) => !prev);
        return router.push(endpoints.home);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  /**
   *@import_account - adding a exist account
   */

  const handlePopup = async () => {
    setPopupImportModal((prev) => !prev);
  };

  // for random keys
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

  const handleGenerateModal = (e) => {
    e.stopPropagation();
    setGeneratePopup(false);
    const Mnemonic_split_string = mnemonicKey?.split(' ');
    randomize(Mnemonic_split_string);
    setMnemonicVerifyModel(true);
  };

  /**@Authentications */

  const handleSignAuthencation1 = () => {
    if (checkEmptyValue(password)) {
      setSignupModal(true);
      setModal1(true);
      setModal2(false);
    } else {
      handlePopup(true);
    }
  };

  const handleSignAuthencation2 = () => {
    if (checkEmptyValue(password)) {
      setSignupModal(true);
      setModal2(true);
      setModal1(false);
    } else {
      handleCreateOpenModal();
    }
  };

  return (
    <>
      <div className="flex justify-center items-center mt-4">
        <Card className="w-96 bg-gray-50">
          <div className="flex flex-col justify-center items-center my-4  p-2">
            <Image src="/bitcoin-sv-bsv-logo.svg" alt="bsv-logo" width={100} height={100} />
            <h1 className="text-center text-2xl my-2 font-semibold leading-loose text-gray-900">
              Welcome to Bitcoin SV Wallet
            </h1>
          </div>
          <Button type="button" gradientMonochrome="purple" onClick={handleSignAuthencation1}>
            Import Account
          </Button>
          <Button type="button" gradientMonochrome="pink" onClick={handleSignAuthencation2}>
            Create Account
          </Button>
        </Card>
      </div>

      {/* import your Account - modal  */}
      <ImportAccountModal
        popup={popupImportModal}
        onClose={() => setPopupImportModal(false)}
        title="Import an Account !"
        description="add your mnemonic key here below down!"
      />

      {/* create modal  */}
      <Modal show={generatePopup} size="md" popup={true} onClose={() => setGeneratePopup(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-3xl font-bold text-gray-900 dark:text-gray-400"> Secret Recovery Mnemonic</h3>
            <p className="mb-5 text-base font-normal text-gray-500 dark:text-gray-400">
              Your Secret Recovery Phrase makes it easy to back up and restore your account.
            </p>
            <p className="mb-5 text-base  font-normal text-gray-500 dark:text-gray-400 mt-1">
              WARNING: Never disclose your Secret Recovery Phrase. Anyone with this phrase can take your Ether forever.
            </p>
            {/* <div className="bg-gray-100  grid grid-cols-2">
              {isMatchIndex?.map((val, i) => {
                return (
                  <button className="bg-blue-900 text-white px-4 hover:bg-blue-900 rounded-lg p-1 m-1  " key={i}>
                    {i + 1}. {val}
                  </button>
                );
              })}
            </div> */}
            {/* <span className="text-center text-gray-600">or</span> */}
            {/* copy mnemonic key */}
            <div className="border rounded-lg bg-gray-200 p-2">
              <CopyClipBoard walletAddress={mnemonicKey} isSort={false} />
            </div>

            <div className="flex flex-col gap-4 my-4">
              <Button type="submit" gradientDuoTone="purpleToBlue" onClick={(e) => handleGenerateModal(e)}>
                Next
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* create your Account - modal (generate mnemonic key)  */}
      <Modal
        show={mnemonicVerifyModel}
        size="md"
        popup={true}
        onClose={() => {
          setMnemonicVerifyModel(false);
          setGeneratePopup(true);
        }}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-3xl font-bold text-gray-900 dark:text-gray-400"> Confirm your Secret Mnemonic</h3>
            <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Please select each Mnemonic in order to make sure it is correct.
            </p>

            <div className=" w-full bg-gray-100 grid grid-cols-2 py-3 mt-8 ">
              {sequenceMnemonicKey.map((val, i) => {
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
            <form className="flex flex-col gap-4 my-4" onSubmit={handleCreateAccount}>
              <Button
                type="button"
                gradientMonochrome="failure"
                onClick={() => {
                  setMnemonicVerifyModel(false);
                  setGeneratePopup(true);
                }}
              >
                Back
              </Button>
              <Button
                type="submit"
                gradientDuoTone="purpleToBlue"
                disabled={!isMnemonicVerifyBtn}
                className={`${isMnemonicVerifyBtn ? '' : 'disabled:opacity-30'}`}
              >
                Create Your Wallet
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {/* signup modal for create account  */}
      {modal2 && (
        <SignUpPage signupModal={signupModal} onClose={() => setSignupModal(false)} signup={handleCreateOpenModal} />
      )}

      {/* signup modal for import account  */}
      {modal1 && <SignUpPage signupModal={signupModal} onClose={() => setSignupModal(false)} signup={handlePopup} />}
    </>
  );
};

export default Connect;
