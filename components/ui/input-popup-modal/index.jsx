import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { ImportAccountData } from '@/services/web3-service/bsv.js';
import { Encryption } from '@/helpers/encryptionAndDecryption';
import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { AddAccount } from '@/store/features/add-account/index';
import { ConnetedWallet } from '@/store/features/wallet-connect/index';
import { AuthenticatedUser } from '@/store/features/authentication/index';
import { ArrayToString } from '@/helpers/arrayToString';
import { endpoints } from '@/routes/endpoints';
import QrScanner from '@/components/common/qr-scanner/index';
import { trimSpaces } from '@/utils/trimSpaces';

const avatar = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg';

const mnemonicData = {
  one: '',
  two: '',
  three: '',
  four: '',
  five: '',
  six: '',
  seven: '',
  eight: '',
  nine: '',
  ten: '',
  eleven: '',
  twelve: '',
};

const ImportAccountModal = ({ isResetAuth = false, popup, onClose, title, description }) => {
  const { addAccount } = useSelector((state) => state.addAccount);
  const { password } = useSelector((state) => state.authentication);
  const router = useRouter();
  const dispatch = useDispatch();

  const [mnemonicValue, setMnemonicValue] = useState(mnemonicData);
  const [nameField, setNameField] = useState('');
  const [getError, setGetError] = useState('');
  const [qrModal, setQrModal] = useState(false);

  const onChange = (e) => {
    e.preventDefault();
    setMnemonicValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnClose = () => {
    setMnemonicValue(mnemonicData);
    setNameField('');
    setGetError('');
    onClose();
  };

  const submitImportAccount = async (e) => {
    e.preventDefault();
    try {
      const propertyValues = Object.values(mnemonicValue);
      const _getMnemonic = ArrayToString(propertyValues);
      const getMnemonic = trimSpaces(_getMnemonic);
      if (checkEmptyValue(_getMnemonic) || checkEmptyValue(getMnemonic)) return toast.error('Invalid Mnemonic key!');
      // Name Already Exist
      const oldName = addAccount?.find((item) => item.account === nameField);
      if (oldName?.account?.toLowerCase() === nameField?.toLowerCase()) {
        return setGetError(`"${nameField?.toLowerCase()}" Already Exist! Please Choose Another Name!`);
      }
      // mnemonic account already exist
      const encryptedMnemonicKey = Encryption(getMnemonic);
      const existMnemonicKey = addAccount?.find((item) => item.mnemonic === encryptedMnemonicKey);
      if (existMnemonicKey?.mnemonic === encryptedMnemonicKey) {
        setMnemonicValue(mnemonicData);
        return toast.error('this mnemonic account already exist!!');
      }

      const { getAddress, getBalance, getNetwork } = await ImportAccountData(getMnemonic, 'mainnet');
      if (
        !checkEmptyValue(encryptedMnemonicKey) &&
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork)
      ) {
        const count = addAccount.length + 1;
        const _account = !checkEmptyValue(nameField) ? nameField : `Account-${count}`;
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
        if (isResetAuth) {
          // remove auth for a week(7*24*60*60)
          const oneWeek = 7 * 24 * 60 * 60 * 1000;
          setTimeout(() => {
            dispatch(AuthenticatedUser({ password: password, auth: false }));
            router.replace(endpoints.login);
          }, oneWeek);
        }

        handleOnClose();
        return router.push(endpoints.home);
      }
    } catch (error) {
      return toast.error('Invalid Mnemonic Key');
    }
  };

  const onPasteHandler = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').replace(/[^a-zA-Z 0-9\n\r]+/g, '');
    const arrIndex = data?.split(' ');
    updateImporTHandle(arrIndex);
  };

  const updateImporTHandle = (arrIndex) => {
    setMnemonicValue({
      one: arrIndex[0],
      two: arrIndex[1],
      three: arrIndex[2],
      four: arrIndex[3],
      five: arrIndex[4],
      six: arrIndex[5],
      seven: arrIndex[6],
      eight: arrIndex[7],
      nine: arrIndex[8],
      ten: arrIndex[9],
      eleven: arrIndex[10],
      twelve: arrIndex[11],
    });
  };

  const handleQROpenModal = (e) => {
    e.preventDefault();
    onClose();
    setQrModal(true);
  };

  return (
    <>
      <Modal show={popup} size="lg" popup={true} onClose={handleOnClose} className="modals">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-400">{title}</h3>
            <p className="text-sm my-4 font-fono text-gray-500 dark:text-gray-400">{description}</p>

            <div className="border-2 flex justify-center items-center p-3 rounded-lg">
              <div className="flex flex-col justify-between">
                <form className="flex flex-col gap-4" onSubmit={submitImportAccount}>
                  <div>
                    <TextInput
                      autoComplete="off"
                      className="w-full lowercase"
                      title="Account Name"
                      placeholder="Account Name (optional)"
                      type="text"
                      value={nameField?.toLowerCase()}
                      onChange={(e) => setNameField(e.target.value)}
                      required={false}
                    />
                    {getError && <p className="text-start text-red-600 ml-2 my-1">{getError}</p>}
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="1"
                      placeholder="1"
                      type="text"
                      required={true}
                      name="one"
                      onChange={onChange}
                      value={mnemonicValue?.one?.toLowerCase()}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="2"
                      placeholder="2"
                      type="text"
                      name="two"
                      value={mnemonicValue?.two?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="3"
                      placeholder="3"
                      type="text"
                      name="three"
                      value={mnemonicValue?.three?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="4"
                      placeholder="4"
                      type="text"
                      name="four"
                      value={mnemonicValue?.four?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="5"
                      placeholder="5"
                      type="text"
                      name="five"
                      value={mnemonicValue?.five?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="6"
                      placeholder="6"
                      type="text"
                      name="six"
                      value={mnemonicValue?.six?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="7"
                      placeholder="7"
                      type="text"
                      name="seven"
                      value={mnemonicValue?.seven?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="8"
                      placeholder="8"
                      type="text"
                      name="eight"
                      value={mnemonicValue?.eight?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="9"
                      placeholder="9"
                      type="text"
                      name="nine"
                      value={mnemonicValue?.nine?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="10"
                      placeholder="10"
                      type="text"
                      name="ten"
                      value={mnemonicValue?.ten?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="11"
                      placeholder="11"
                      type="text"
                      name="eleven"
                      value={mnemonicValue?.eleven?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                    <TextInput
                      autoComplete="off"
                      className="lowercase"
                      title="12"
                      placeholder="12"
                      type="text"
                      name="twelve"
                      value={mnemonicValue?.twelve?.toLowerCase()}
                      required={true}
                      onChange={onChange}
                      onPaste={(event) => {
                        onPasteHandler(event);
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    title="Scan Your QR Code"
                    className="cursor-pointer text-green-700 hover:text-green-500 font-bold"
                    onClick={handleQROpenModal}
                  >
                    or Scan a QR Code
                  </button>

                  <Button type="submit" title="import account" className="mt-4">
                    import
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Scan a QR Code modal  */}
      <QrScanner
        isResetAuth={isResetAuth}
        show={qrModal}
        setQrModal={setQrModal}
        onClose={() => {
          onClose();
          setQrModal(false);
        }}
        title="Scan QR Code"
        description="scan QR to import your account."
      />
    </>
  );
};

ImportAccountModal.propTypes = {
  isResetAuth: PropTypes.bool,
  popup: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ImportAccountModal;
