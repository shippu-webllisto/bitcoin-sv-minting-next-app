import { useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Button, Label, Modal, TextInput } from 'flowbite-react';

import { getShortAddress } from '@/utils/getShortAddress.js';
import { endpoints } from '@/routes/endpoints';
import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { AddAccount } from '@/store/features/add-account/index';
import { CopyClipboard } from '@/helpers/CopyClipboard';
import { ImportWallet } from '@/store/features/wallet-connect/index';
import InputPopupModal from '../input-popup-modal/index';
import { CreateAccountData, ImportAccountData } from '@/services/web3-service/bsv';

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
  const [mnemonicValue, setMnemonicValue] = useState('');

  const [popupImportModal, setPopupImportModal] = useState(false);
  const [importValue, setImportValue] = useState('');

  const handleOpenAccount = (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  const handleCreateNewAccountModal = (e) => {
    e.preventDefault();
    setPopup((prev) => !prev);
  };

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
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(mnemonicKey) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork)
      ) {
        const count = addAccount.length + 1;

        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: mnemonicValue,
            privateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: `Account-${count}`,
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
            account: `Account-${count}`,
          }),
        );

        // close popup and clear input
        setGeneratePopup((prev) => !prev);
        setMnemonicValue('');
        setPopup(false);
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
  const handleRestoreMnemonicModal = (e) => {
    e.preventDefault();
    setPopupImportModal((prev) => !prev);
  };

  const submitImportAccount = async (e) => {
    e.preventDefault();
    if (checkEmptyValue(importValue)) return toast.error('please, fill the required fields.');
    try {
      const { getAddress, getBalance, getNetwork } = await ImportAccountData(importValue);

      if (
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(importValue) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork)
      ) {
        const count = addAccount.length + 1;
        dispatch(
          AddAccount({
            walletAddress: getAddress,
            mnemonic: importValue,
            privateKey: '',
            network: getNetwork,
            bsvAmount: getBalance,
            avatar: avatar,
            account: `Account-${count}`,
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
            account: `Account-${count}`,
          }),
        );

        // close popup and clear input
        setPopupImportModal((prev) => !prev);
        setImportValue('');
        setPopup(false);
        return router.push(endpoints.home);
      }
    } catch (error) {
      return new Error(error.message);
    }
  };

  const handleSeletcedAccount = (item) => {
    dispatch(ImportWallet(item));
  };

  return (
    <>
      <div className="inline-flex text-center bg-white my-1 justify-center ">
        <div className="relative">
          <div className="flex bg-[#f5f7fa] hover:border-black border-2  rounded-full my-2 px-10 p-3 m-3 align-middle">
            <button className="flex justify-between px-6 text-sm text-gray-400 w-full" onClick={handleOpenAccount}>
              <Image
                className="rounded-full mt-2"
                src={WalletConnect?.avatar ?? '/assets/svgs/user.svg'}
                alt="logo"
                width={30}
                height={30}
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
            <Button gradientDuoTone="purpleToBlue" className="my-2" onClick={handleCreateOpenModal}>
              Create New Mnemonic(12-Words) Account
            </Button>
            <Button gradientDuoTone="purpleToPink" className="my-2" onClick={handleRestoreMnemonicModal}>
              Restore from Mnemonic
            </Button>
            {/* <Button gradientDuoTone="pinkToOrange" className="my-2">
              Restore from Private Key
            </Button> */}
          </div>
        </Modal.Body>
      </Modal>

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

      {/* import your Account - modal  */}
      <InputPopupModal
        popup={popupImportModal}
        handlePopup={handleRestoreMnemonicModal}
        title="Import an Account"
        description="add your Mnemonic key here below down."
        placeholder="Enter Your Mnemonic Key"
        inputValue={importValue}
        onChange={setImportValue}
        onSubmit={submitImportAccount}
      />
    </>
  );
};

export default AccountDropDown;
