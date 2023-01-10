import React, { useState } from 'react';
import { Button, TextInput } from 'flowbite-react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Encryption } from '@/helpers/encryptionAndDecryption';
import { ArrayToString } from '@/helpers/arrayToString';

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

const InputBoxes = () => {
  const { addAccount } = useSelector((state) => state.addAccount);

  const [mnemonicValue, setMnemonicValue] = useState(mnemonicData);
  const [verify, setVerify] = useState(false);

  const onChange = (e) => {
    setMnemonicValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVerify = () => {
    try {
      const propertyValues = Object.values(mnemonicValue);
      const getMnemonic = ArrayToString(propertyValues);

      const encryptedMnemonicKey = Encryption(getMnemonic);
      const getUser = addAccount?.find((item) => item.mnemonic === encryptedMnemonicKey);
      if (!getUser) return toast.error('Invalid Mnemonic Key');
      setVerify(true);
    } catch (error) {
      return new Error(error.message);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-2">
        <TextInput
          title="1"
          placeholder="1"
          type="text"
          required={true}
          name="one"
          onChange={onChange}
          value={mnemonicValue?.one}
        />
        <TextInput
          title="2"
          placeholder="2"
          type="text"
          name="two"
          value={mnemonicValue?.two}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="3"
          placeholder="3"
          type="text"
          name="three"
          value={mnemonicValue?.three}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="4"
          placeholder="4"
          type="text"
          name="four"
          value={mnemonicValue?.four}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="5"
          placeholder="5"
          type="text"
          name="five"
          value={mnemonicValue?.five}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="6"
          placeholder="6"
          type="text"
          name="six"
          value={mnemonicValue?.six}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="7"
          placeholder="7"
          type="text"
          name="seven"
          value={mnemonicValue?.seven}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="8"
          placeholder="8"
          type="text"
          name="eight"
          value={mnemonicValue?.eight}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="9"
          placeholder="9"
          type="text"
          name="nine"
          value={mnemonicValue?.nine}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="10"
          placeholder="10"
          type="text"
          name="ten"
          value={mnemonicValue?.ten}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="11"
          placeholder="11"
          type="text"
          name="eleven"
          value={mnemonicValue?.eleven}
          required={true}
          onChange={onChange}
        />
        <TextInput
          title="12"
          placeholder="12"
          type="text"
          name="twelve"
          value={mnemonicValue?.twelve}
          required={true}
          onChange={onChange}
        />
      </div>
      <div className="my-4 mb-0 flex justify-center items-center">
        <Button type="button" gradientDuoTone="pinkToOrange" outline={true} onClick={handleVerify} disabled={verify}>
          <span>Verify</span>
          {verify && <Image src="/assets/svgs/check.svg" alt="check-icon" className="mx-2" width={20} height={20} />}
        </Button>
      </div>
    </>
  );
};

export default InputBoxes;
