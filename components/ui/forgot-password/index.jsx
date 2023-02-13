import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { HashPassword } from '@/helpers/bcryptjs';
import { AuthenticatedUser } from '@/store/features/authentication/index';
import InputBoxes from '../input-boxes/index';
import { endpoints } from '@/routes/endpoints';

const forgotForm = {
  password: '',
  confirmPassword: '',
};

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

function ForgotPassword({ forgotModal, onClose }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [signupData, setSignupData] = useState(forgotForm);

  const [verify, setVerify] = useState(false);
  const [mnemonicValue, setMnemonicValue] = useState(mnemonicData);

  const onChange = (e) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
        PopupCloseHanler(); // close modal
        clearDisabledState();
        setMnemonicValue({ ...mnemonicData });
        return router.push(endpoints.login);
      }
    } catch (error) {
      clearDisabledState();
      return new Error(error.message);
    }
  };

  const clearDisabledState = (data) => {
    setVerify(data);
  };

  const verifyInputHandler = useCallback(
    (e) => {
      setMnemonicValue((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mnemonicValue],
  );

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

  const PopupCloseHanler = () => {
    onClose();
    setMnemonicValue({ ...mnemonicData });
    setVerify(false);
    setSignupData({ ...forgotForm });
  };

  return (
    <Modal show={forgotModal} size="lg" popup={true} onClose={PopupCloseHanler} className="modals">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="text-3xl font-normal text-gray-900 dark:text-gray-400">Reset Your Password</h3>
          <p className="text-sm font-mono text-gray-500 dark:text-gray-400 my-2">please enter your memonic key!</p>
          <div className="border-2 flex justify-center items-center p-3 rounded-lg">
            <div className="flex flex-col justify-between">
              {/* 12 input box for Mnemonic key  */}
              <InputBoxes
                clearDisabledState={clearDisabledState}
                verify={verify}
                verifyInputHandler={verifyInputHandler}
                mnemonicValue={mnemonicValue}
                updateImporTHandle={updateImporTHandle}
                PopupCloseHanler={PopupCloseHanler}
              />
            </div>
          </div>
          <div className="my-4">
            <h1 className="p-2 font-bold text-center font-sans">create new password :)</h1>
            <p className="text-center text-sm font-mono text-gray-500 dark:text-gray-400">
              please, do&lsquo;t share this password with anyone!
            </p>
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
