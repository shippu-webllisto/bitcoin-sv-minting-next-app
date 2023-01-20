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

const ImportAccountModal = ({ popup, onClose, title, description }) => {
  const { addAccount } = useSelector((state) => state.addAccount);
  const { password } = useSelector((state) => state.authentication);

  const router = useRouter();
  const dispatch = useDispatch();

  const [mnemonicValue, setMnemonicValue] = useState(mnemonicData);

  const onChange = (e) => {
    e.preventDefault();
    setMnemonicValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitImportAccount = async (e) => {
    e.preventDefault();
    try {
      const propertyValues = Object.values(mnemonicValue);
      const getMnemonic = ArrayToString(propertyValues);
      if (checkEmptyValue(getMnemonic)) return toast.error('Invalid Mnemonic key!');

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
        // remove auth for a week(7*24*60*60)
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        setTimeout(() => {
          dispatch(AuthenticatedUser({ password: password, auth: false }));
          router.replace(endpoints.login);
        }, oneWeek);

        setMnemonicValue(mnemonicData);
        onClose();
        return router.push(endpoints.home);
      }
    } catch (error) {
      return toast.error(error.message);
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

  return (
    <Modal show={popup} size="lg" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-400">{title}</h3>
          <p className="text-sm my-4 font-fono text-gray-500 dark:text-gray-400">{description}</p>

          <div className="border-2 flex justify-center items-center p-3 rounded-lg">
            <div className="flex flex-col justify-between">
              <form className="flex flex-col gap-4" onSubmit={submitImportAccount}>
                <div className="grid grid-cols-3 gap-4">
                  <TextInput
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

                <Button type="submit" className="mt-4">
                  import
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

ImportAccountModal.propTypes = {
  popup: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ImportAccountModal;
