import { useState } from 'react';
import { Button, Card, Label, Modal, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { endpoints } from '@/routes/endpoints.js';
import InputPopupModal from '@/components/ui/input-popup-modal/index.jsx';
import { CopyClipboard } from '@/helpers/CopyClipboard.js';
import { checkEmptyValue } from '@/utils/checkEmptyValue.js';
import { CreateAccountData, ImportAccountData } from '@/services/web3-service/bsv.js';
import { AddAccount } from '@/store/features/add-account/index';
import { ConnetedWallet } from '@/store/features/wallet-connect/index';
import { Encryption } from '@/helpers/encryptionAndDecryption';
import SignUpPage from '@/components/common/signup/index';
import LoginPage from '@/components/common/login/index';

const avatar = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg';

const Connect = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { password } = useSelector((state) => state.authentication);

  const [generatePopup, setGeneratePopup] = useState(false);
  const [mnemonicKey, setMnemonicKey] = useState('');
  const [mnemonicValue, setMnemonicValue] = useState('');

  const [popupImportModal, setPopupImportModal] = useState(false);
  const [importValue, setImportValue] = useState('');

  // const [resetWalletModal, setResetWalletModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [signupModal, setSignupModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [modal2, setModal2] = useState(false);

  /**
   *! create a new Account
   */
  const handleCreateOpenModal = async () => {
    // generating mnemonic key
    const { getMnemonicKey } = await CreateAccountData('mainnet');
    if (!checkEmptyValue(getMnemonicKey)) {
      setMnemonicKey(getMnemonicKey);
      setGeneratePopup((prev) => !prev);
    }
  };

  const handleCopyText = (e) => {
    e.preventDefault();
    CopyClipboard(mnemonicKey);
    return toast.success('copied');
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      if (checkEmptyValue(mnemonicValue)) return toast.error('please, fill the required fields.');

      const encryptedMnemonicKey = Encryption(mnemonicValue);
      const { getAddress, getBalance, getNetwork } = await CreateAccountData('mainnet');
      if (
        !checkEmptyValue(mnemonicKey) &&
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork) &&
        !checkEmptyValue(encryptedMnemonicKey)
      ) {
        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: encryptedMnemonicKey,
            testnetPrivateKey: '',
            mainnetPrivateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: 'Account-1',
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
            account: 'Account-1',
          }),
        );
        // close popup and clear input
        setGeneratePopup((prev) => !prev);
        setMnemonicValue('');
        return router.push(endpoints.home);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  /**
   *! import_account - adding a exist account
   */

  const handlePopup = () => {
    setPopupImportModal((prev) => !prev);
  };

  const submitImportAccount = async (e) => {
    e.preventDefault();
    if (checkEmptyValue(importValue)) return toast.error('please, fill the required fields.');
    try {
      const encryptedMnemonicKey = Encryption(importValue);
      const { getAddress, getBalance, getNetwork } = await ImportAccountData(importValue, 'mainnet');
      if (
        !checkEmptyValue(importValue) &&
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork) &&
        !checkEmptyValue(encryptedMnemonicKey)
      ) {
        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: encryptedMnemonicKey,
            testnetPrivateKey: '',
            mainnetPrivateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: 'Account-1',
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
            account: 'Account-1',
          }),
        );

        // close popup and clear input
        setPopupImportModal((prev) => !prev);
        setImportValue('');
        return router.push(endpoints.home);
      }
    } catch (error) {
      return new Error(error.message);
    }
  };

  /**@Authentications */
  // const handleResetWalletModal = () => {
  //   setResetWalletModal((prev) => !prev);
  // };

  const handleSignAuthencation1 = () => {
    setSignupModal((prev) => !prev);
    setModal1((prev) => !prev);
  };

  const handleSignAuthencation2 = () => {
    setSignupModal((prev) => !prev);
    setModal2((prev) => !prev);
  };

  const handleLogin = () => {
    setLoginModal((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-center items-center mt-4 ">
        <Card className="w-96 bg-gray-50">
          <div className="flex flex-col justify-center items-center my-4  p-2">
            <Image src="/bitcoin-sv-bsv-logo.svg" alt="bsv-logo" width={100} height={100} />
            <h1 className="text-center text-2xl my-2 font-semibold leading-loose text-gray-900">
              Welcome to Bitcoin SV Wallet
            </h1>
          </div>
          <Button type="button" gradientMonochrome="purple" onClick={password ? handleLogin : handleSignAuthencation1}>
            Import Account
          </Button>
          <Button type="button" gradientMonochrome="pink" onClick={password ? handleLogin : handleSignAuthencation2}>
            Create Account
          </Button>
          {/* <div className="text-center">
            <button type="button" onClick={handleResetWalletModal}>
              Reset Account
            </button>
          </div> */}
        </Card>
      </div>

      {/* import your Account - modal  */}
      <InputPopupModal
        popup={popupImportModal}
        handlePopup={() => setPopupImportModal(false)}
        title="Import an Account"
        description="add your Mnemonic key here below down."
        placeholder="Enter Your Mnemonic Key"
        inputValue={importValue}
        onChange={setImportValue}
        onSubmit={submitImportAccount}
      />

      {/* create your Account - modal (generate mnemonic key)  */}
      <Modal show={generatePopup} size="md" popup={true} onClose={() => setGeneratePopup(false)}>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-3xl font-bold text-gray-900 dark:text-gray-400">Create an Account</h3>
            <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              don&lsquo;t share this Mnemonic with Anyones.
            </p>
            <div className="bg-gray-100 flex">
              <span className="bg-gray-200 p-1 m-1 ">{mnemonicKey}</span>
              <Image
                className="mx-2 cursor-pointer"
                src="/assets/svgs/copy-icon.svg"
                alt="cpoy-clip-logo"
                width={15}
                height={15}
                onClick={handleCopyText}
              />
            </div>
            <form className="flex flex-col gap-4 my-4" onSubmit={handleCreateAccount}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="input1" />
                </div>
                <TextInput
                  id="input1"
                  type="text"
                  placeholder="Enter Your Mnemonic Key"
                  required={true}
                  onChange={(e) => setMnemonicValue(e.target.value)}
                  value={mnemonicValue}
                />
              </div>

              <Button type="submit" gradientDuoTone="purpleToBlue">
                Yes, Im sure
              </Button>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {/* login modal  */}
      <LoginPage loginModal={loginModal} onClose={() => setLoginModal(false)} password={password} />

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
