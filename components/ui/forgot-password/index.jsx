import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { Encryption } from '@/helpers/encryptionAndDecryption';
import { HashPassword } from '@/helpers/bcryptjs';
import { AuthenticatedUser } from '@/store/features/authentication/index';
import Image from 'next/image';

const forgotForm = {
  password: '',
  confirmPassword: '',
};

function ForgotPassword({ forgotModal, onClose }) {
  const { addAccount } = useSelector((state) => state.addAccount);
  const dispatch = useDispatch();
  const [signupData, setSignupData] = useState(forgotForm);
  const [mnemonicValue, setMnemonicValue] = useState('');
  const [verify, setVerify] = useState(false);

  const onChange = (e) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleVerify = () => {
    if (checkEmptyValue(mnemonicValue)) return toast.error('Mnemonic Key is Required!!');
    try {
      const encryptedMnemonicKey = Encryption(mnemonicValue);
      const getUser = addAccount?.find((item) => item.mnemonic === encryptedMnemonicKey);
      if (!getUser) return toast.error('Invalid Mnemonic Key');

      setVerify(true);
    } catch (error) {
      return new Error(error.message);
    }
  };

  const handleSubmitForgotPassword = (e) => {
    e.preventDefault();
    if (checkEmptyValue(signupData.password) || checkEmptyValue(signupData.confirmPassword))
      return toast.error('please, fill the required fields.');
    if (signupData.password.length < 8) return toast.error('password length should must be 8-digits.');
    if (signupData.password !== signupData.confirmPassword)
      return toast.error('password and confirm-password are not same.');
    try {
      const hashPassword = HashPassword(signupData.password);
      if (!checkEmptyValue(hashPassword)) {
        dispatch(AuthenticatedUser({ password: hashPassword, auth: false }));

        setSignupData(forgotForm);
        onClose(); // close modal
        return router.push(endpoints.login);
      }
    } catch (error) {
      return new Error(error.message);
    }
  };

  return (
    <Modal show={forgotModal} size="lg" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="text-3xl font-normal text-gray-900 dark:text-gray-400">Reset Your Password</h3>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 my-2">please enter your memonic key.</p>
          {/* <div className="border-2 flex justify-center items-center p-3 rounded-lg"> */}
          <div className="flex flex-row justify-between my-4">
            <TextInput
              className="w-full"
              id="input1"
              type="text"
              placeholder="Enter Your Mnemonic Key"
              value={mnemonicValue}
              required={true}
              onChange={(e) => setMnemonicValue(e.target.value)}
            />
            <Button
              type="button"
              className="flex justify-between flex-row ml-2"
              outline={true}
              gradientDuoTone="pinkToOrange"
              onClick={handleVerify}
              disabled={verify}
            >
              <span>Verify</span>
              {verify && (
                <Image src="/assets/svgs/check.svg" alt="check-icon" className="mx-2" width={20} height={20} />
              )}
            </Button>
          </div>
          {/* </div> */}
          <div>
            <h1 className="p-2 font-bold text-center font-sans underline">create new password</h1>
            {/* <p className="text-center text-sm font-mono"></p> */}
            <form className="p-2 flex flex-col gap-4" onSubmit={handleSubmitForgotPassword}>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="password" />
                </div>
                <TextInput
                  id="password"
                  type="password"
                  placeholder="new password"
                  name="password"
                  required={true}
                  onChange={onChange}
                  value={signupData?.password}
                  autoComplete="new-password"
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="confirmPassword" />
                </div>
                <TextInput
                  id="confirmPassword"
                  type="password"
                  placeholder="confirm password"
                  name="confirmPassword"
                  required={true}
                  onChange={onChange}
                  value={signupData?.confirmPassword}
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" className="my-2" gradientMonochrome="info" pill={true}>
                Submit
              </Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

ForgotPassword.propTypes = {
  forgotModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ForgotPassword;
