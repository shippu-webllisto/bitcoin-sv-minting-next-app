import { useState } from 'react';
import { Card } from 'flowbite-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';

import { endpoints } from '@/routes/endpoints.js';
import { getShortAddress } from '@/utils/getShortAddress';
import PopupModal from '@/components/ui/popup-modal/index.jsx';
import { ConnetedWallet, ResetWallet } from '@/store/features/wallet-connect/index.jsx';
import { ResetAddAccount, UpdateAccount } from '@/store/features/add-account/index';
import ExportDataModal from '@/components/common/export-data-modal/index';
import { ImportAccountData } from '@/services/web3-service/bsv';
import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { Decryption } from '@/helpers/encryptionAndDecryption';
import { AuthenticatedUser, ResetAuthentication } from '@/store/features/authentication/index';
import InputPasswordModal from '@/components/ui/input-password-modal/index';

const Setting = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { password } = useSelector((state) => state.authentication);
  const { addAccount } = useSelector((state) => state.addAccount);
  const WalletConnect = useSelector((state) => state.walletConnect);

  const [swichNetworkpopup, setSwichNetworkpopup] = useState(false);
  const [exportMnemonicPopup, setExportMnemonicPopup] = useState(false);
  const [mnemonicHash, setMnemonicHash] = useState('');
  const [passwordModal1, setPasswordModal1] = useState(false);
  const [passwordModal2, setPasswordModal2] = useState(false);
  const [passwordModal3, setPasswordModal3] = useState(false);
  // const [passwordModal4, setPasswordModal4] = useState(false);
  // const [exportPrivateKeyPopup, setExportPrivateKeyPopup] = useState(false);
  // const [privateKeyHash, setPrivateKeyHash] = useState('');

  const openMnemonicModal = () => {
    setPasswordModal1((prev) => !prev);
  };
  const openDeleteModal = () => {
    setPasswordModal2((prev) => !prev);
  };
  const openResetModal = () => {
    setPasswordModal3((prev) => !prev);
  };

  const handleResetWallet = () => {
    dispatch(ResetAuthentication());
    dispatch(ResetWallet());
    dispatch(ResetAddAccount());
    return router.push(endpoints.connect);
  };

  const handleCurrentDeleteAccount = () => {
    // if user have only one account
    const Length = addAccount.length === 1;
    if (Length) return handleResetWallet();

    // if user have multiple account
    const updatedData = addAccount?.filter((item) => item.mnemonic !== WalletConnect.mnemonic);
    dispatch(ResetWallet());

    const data = updatedData?.map((item, i) => {
      return { ...item, account: `Account-${i + 1}` };
    });
    if (data) {
      dispatch(ConnetedWallet({ ...data[0] }));
      dispatch(UpdateAccount(data));
      return router.push(endpoints.home);
    }
  };

  const handleLock = () => {
    dispatch(AuthenticatedUser({ password: password, auth: false }));
    router.reload();
    return router.replace(endpoints.login);
  };

  const handleSwitchNetwork = () => {
    setSwichNetworkpopup((prev) => !prev);
  };

  const handleChangeNetwork = async () => {
    const network = WalletConnect?.network === 'testnet' ? 'mainnet' : 'testnet';
    const { getAddress, getBalance, getNetwork } = await ImportAccountData(WalletConnect.mnemonic, network);
    if (
      !checkEmptyValue(network) &&
      !checkEmptyValue(getAddress) &&
      !checkEmptyValue(getBalance) &&
      !checkEmptyValue(getNetwork)
    ) {
      const updatedData = addAccount?.map((item) => {
        if (item.mnemonic === WalletConnect.mnemonic) {
          return { ...WalletConnect, network: getNetwork, walletAddress: getAddress, bsvAmount: getBalance };
        }
        return item;
      });
      dispatch(
        ConnetedWallet({ ...WalletConnect, network: getNetwork, walletAddress: getAddress, bsvAmount: getBalance }),
      );
      dispatch(UpdateAccount(updatedData));
      setSwichNetworkpopup(false);
    }
  };

  const handleExportMnemonic = () => {
    const decryptedMnemonicKey = Decryption(WalletConnect?.mnemonic);
    if (!checkEmptyValue(decryptedMnemonicKey)) {
      setMnemonicHash(decryptedMnemonicKey);
      setExportMnemonicPopup((prev) => !prev);
    }
  };

  // for -> private key
  // const openPrivateModal = () => {
  //   setPasswordModal4((prev) => !prev);
  // };

  //   const handleExportPrivateKey = () => {
  //     const decryptedPrivateKey = Decryption(
  //       WalletConnect?.privateKey,
  //     );
  //     if (!checkEmptyValue(decryptedPrivateKey)) {
  //       setPrivateKeyHash(decryptedPrivateKey);
  //       setExportPrivateKeyPopup((prev) => !prev);
  //     }
  //   };

  return (
    <>
      <div className="flex justify-center my-4">
        <Card className="w-96">
          <div className="flex justify-between mb-2 font-mono">
            <h1>Setting</h1>
            <Image
              className="rounded-full cursor-pointer w-6"
              src="/assets/images/cross-23.png"
              alt="cross-icon"
              width={20}
              height={20}
              onClick={() => router.push(endpoints.home)}
            />
          </div>
          <h5 className="text-base font-semibold text-gray-900 dark:text-white lg:text-xl">Account Management</h5>
          <hr />
          <ul className="my-4 space-y-3">
            <li key={1}>
              <button
                type="button"
                disabled
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
              >
                <Image
                  className="rounded-full"
                  src="/assets/svgs/account-icon.svg"
                  alt="Delete-Icon"
                  width={20}
                  height={20}
                />
                <span className="ml-3 flex-1 whitespace-nowrap">{getShortAddress(WalletConnect?.walletAddress)}</span>
              </button>
            </li>
            <li key={2}>
              <a
                href={`https://blockcheck.info/address/detail?address=${WalletConnect?.walletAddress}`}
                target="_blank"
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                rel="noreferrer"
              >
                <Image
                  className="rounded-full w-6"
                  src="/assets/svgs/compass.svg"
                  alt="compass"
                  width={20}
                  height={20}
                />
                <span className="ml-3 flex-1 whitespace-nowrap">View Account on blockcheck.info</span>
              </a>
            </li>
            {/* <li key={3}>
              <button
                type="button"
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                onClick={handleSwitchNetwork}
              >
                <Image className="rounded-full w-6" src="/assets/svgs/global.svg" alt="global" width={20} height={20} />
                <span className="ml-3 flex-1 whitespace-nowrap">Change Network</span>
              </button>
            </li> */}
            <li key={4}>
              <button
                type="button"
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                onClick={openMnemonicModal}
              >
                <Image className="rounded-full w-6" src="/assets/svgs/key.svg" alt="global" width={20} height={20} />
                <span className="ml-3 flex-1 whitespace-nowrap">Export Mnemonic</span>
              </button>
            </li>
            {/* <li key={5}>
              <button
                type="button"
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                onClick={openPrivateModal}
              >
                <Image className="rounded-full w-6" src="/assets/svgs/key.svg" alt="global" width={20} height={20} />
                <span className="ml-3 flex-1 whitespace-nowrap">Export Private Key</span>
              </button>
            </li> */}
            <li key={6}>
              <button
                type="button"
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                onClick={openDeleteModal}
              >
                <Image src="/assets/svgs/delete-icon.svg" alt="Delete-Icon" width={20} height={20} />
                <span className="ml-3 flex-1 whitespace-nowrap">Remove Current Account</span>
              </button>
            </li>
            <li key={7}>
              <button
                type="button"
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                onClick={openResetModal}
              >
                <Image src="/assets/svgs/garbage-bin.svg" alt="Reset-Icon" width={20} height={20} />
                <span className="ml-3 flex-1 whitespace-nowrap">Reset wallet</span>
              </button>
            </li>
            <li key={8}>
              <button
                type="button"
                className="group flex w-full rounded-lg bg-gray-200 p-3 text-base font-bold text-gray-900 hover:bg-gray-300 hover:shadow dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                onClick={handleLock}
              >
                <Image src="/assets/svgs/export-arrow-14569.svg" alt="Logout-Icon" width={20} height={20} />
                <span className="ml-3 flex-1 whitespace-nowrap">Lock</span>
              </button>
            </li>
          </ul>
          <hr />
          <div className="text-center">
            <p className="font-mono ">bitcoin sv minting app</p>
          </div>
        </Card>
      </div>

      {/* change network modal  */}
      <PopupModal
        popup={swichNetworkpopup}
        handlePopup={handleSwitchNetwork}
        title="Change Network"
        description="are you sure to switch your network ?"
        onClick={handleChangeNetwork}
      />

      {/* export Mnemonic Popup modal  */}
      <InputPasswordModal
        show={passwordModal1}
        onClose={() => setPasswordModal1(false)}
        onClick={handleExportMnemonic}
        title="Export Mnemonic key"
        description="please, DO NOT share the mnemonic with anyone!"
      />
      <ExportDataModal
        title="Mnemonic Key"
        data={mnemonicHash}
        popup={exportMnemonicPopup}
        onClose={() => setExportMnemonicPopup(false)}
      />

      {/* Delete Current Account modal */}
      <InputPasswordModal
        show={passwordModal2}
        onClose={() => setPasswordModal2(false)}
        onClick={handleCurrentDeleteAccount}
        title="Remove Current Account"
        description="are you sure want to remove your current account?"
      />

      {/* Reset wallet modal */}
      <InputPasswordModal
        show={passwordModal3}
        onClose={() => setPasswordModal3(false)}
        onClick={handleResetWallet}
        title="Reset Accounts"
        description="are you sure to delete your account ? you all data has been deleted"
      />

      {/* export Private Key Popup modal  */}
      {/* <InputPasswordModal
        show={passwordModal4}
        onClose={() => setPasswordModal4(false)}
        onClick={handleExportPrivateKey}
        title="Export Private Key"
        description="please, DO NOT share the private key with anyone!"
      /> */}
      {/* <ExportDataModal
        title="Private Key"
        data={privateKeyHash}
        popup={exportPrivateKeyPopup}
        onClose={() => setExportPrivateKeyPopup(false)}
      /> */}
    </>
  );
};

export default Setting;
