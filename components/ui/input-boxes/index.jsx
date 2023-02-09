import { Button, TextInput } from 'flowbite-react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { Encryption } from '@/helpers/encryptionAndDecryption';
import { ArrayToString } from '@/helpers/arrayToString';
import { trimSpaces } from '@/utils/trimSpaces';

const InputBoxes = ({
  clearDisabledState,
  verify,
  mnemonicValue,
  verifyInputHandler,
  updateImporTHandle,
  PopupCloseHanler,
}) => {
  const { addAccount } = useSelector((state) => state.addAccount);

  const onChange = (e) => {
    e.preventDefault();
    verifyInputHandler(e);
  };

  const handleVerify = () => {
    try {
      const propertyValues = Object.values(mnemonicValue);
      const _getMnemonic = ArrayToString(propertyValues);
      const getMnemonic = trimSpaces(_getMnemonic);

      const encryptedMnemonicKey = Encryption(getMnemonic);
      const getUser = addAccount?.find((item) => item.mnemonic === encryptedMnemonicKey);
      if (!getUser) {
        PopupCloseHanler();
        return toast.error('Invalid Mnemonic Key');
      }
      clearDisabledState(true);
    } catch (error) {
      PopupCloseHanler();
      return new Error(error.message);
    }
  };

  // onPasteHandler
  const onPasteHandler = (e) => {
    e.preventDefault();

    const data = e.clipboardData.getData('text').replace(/[^a-zA-Z 0-9\n\r]+/g, '');
    const arrIndex = data?.split(' ');
    updateImporTHandle(arrIndex);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <TextInput
          className="lowercase"
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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
          disabled={verify}
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

      <div className="my-4 mb-0 flex justify-center items-center">
        <Button
          title="verify-your-mnemonic-key"
          type="button"
          className={`${verify ? 'bg-green-400' : 'bg-red-500'}`}
          onClick={handleVerify}
          disabled={verify}
        >
          <span>Verify</span>
          {verify && <Image src="/assets/svgs/check.svg" alt="check-icon" className="mx-2" width={20} height={20} />}
        </Button>
      </div>
    </>
  );
};

InputBoxes.propTypes = {
  verify: PropTypes.bool,
  clearDisabledState: PropTypes.func,
  mnemonicValue: PropTypes.any,
  verifyInputHandler: PropTypes.func,
  updateImporTHandle: PropTypes.func,
  PopupCloseHanler: PropTypes.func,
};

export default InputBoxes;
