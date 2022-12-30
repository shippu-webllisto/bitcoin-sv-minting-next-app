import { useState } from 'react';
import { Button, Card, Label, Modal, TextInput } from 'flowbite-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import { endpoints } from '@/routes/endpoints.js';
import InputPopupModal from '@/components/ui/input-popup-modal/index.jsx';
import { CopyClipboard } from '@/helpers/CopyClipboard.js';
import { checkEmptyValue } from '@/utils/checkEmptyValue.js';
import { CreateAccountData, ImportAccountData } from '@/services/web3-service/bsv.js';
import { AddAccount } from '@/store/features/add-account/index';
import { ImportWallet } from '@/store/features/wallet-connect/index';

const avatar = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg';

const Connect = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [generatePopup, setGeneratePopup] = useState(false);
  const [mnemonicKey, setMnemonicKey] = useState('');
  const [mnemonicValue, setMnemonicValue] = useState('');

  const [popupImportModal, setPopupImportModal] = useState(false);
  const [importValue, setImportValue] = useState('');

  //! create a new Account
  const handleCreateOpenModal = async (e) => {
    e.preventDefault();
    // generating mnemonic key
    const { getMnemonicKey } = await CreateAccountData();
    if (!checkEmptyValue(getMnemonicKey)) {
      setMnemonicKey(getMnemonicKey);
      setGeneratePopup((prev) => !prev);
    }
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      if (checkEmptyValue(mnemonicValue)) return toast.error('please, fill the required fields.');

      const { getAddress, getBalance, getNetwork } = await CreateAccountData();

      if (
        !checkEmptyValue(mnemonicKey) &&
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork)
      ) {
        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: mnemonicValue,
            privateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: 'Account-1',
          }),
        );
        dispatch(
          ImportWallet({
            walletAddress: getAddress,
            mnemonic: mnemonicValue,
            privateKey: '',
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

  const handleCopyText = (e) => {
    e.preventDefault();
    CopyClipboard(mnemonicKey);
    return toast.success('copyed');
  };

  //! adding a exist account (import account)
  const handlePopup = (e) => {
    e.preventDefault();
    setPopupImportModal((prev) => !prev);
  };

  const submitImportAccount = async (e) => {
    e.preventDefault();
    if (checkEmptyValue(importValue)) return toast.error('please, fill the required fields.');
    try {
      const { getAddress, getBalance, getNetwork } = await ImportAccountData(importValue);

      if (
        !checkEmptyValue(importValue) &&
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork)
      ) {
        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: importValue,
            privateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: 'Account-1',
          }),
        );
        dispatch(
          ImportWallet({
            walletAddress: getAddress,
            mnemonic: importValue,
            privateKey: '',
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
          <Button type="button" gradientMonochrome="purple" onClick={handlePopup}>
            Import Account
          </Button>
          <Button type="button" gradientMonochrome="pink" onClick={handleCreateOpenModal}>
            Create Account
          </Button>
        </Card>
      </div>

      {/* import your Account - modal  */}
      <InputPopupModal
        popup={popupImportModal}
        handlePopup={handlePopup}
        title="Import an Account"
        description="add your Mnemonic key here below down."
        placeholder="Enter Your Mnemonic Key"
        inputValue={importValue}
        onChange={setImportValue}
        onSubmit={submitImportAccount}
      />

      {/* create your Account - modal  */}
      <Modal show={generatePopup} size="md" popup={true} onClose={handleCreateOpenModal}>
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
    </>
  );
};

export default Connect;
