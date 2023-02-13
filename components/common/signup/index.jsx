import React, { useState } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { AuthenticatedUser } from '@/store/features/authentication/index';
import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { HashPassword } from '@/helpers/bcryptjs';

const signupForm = {
  password: '',
  confirmPassword: '',
};

function SignUpPage({ signupModal, onClose, signup }) {
  const dispatch = useDispatch();
  const [signupData, setSignupData] = useState(signupForm);

  const onChange = (e) => {
    setSignupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (checkEmptyValue(signupData?.password) || checkEmptyValue(signupData?.confirmPassword))
      return toast.error('please, fill the required filed.');
    if (signupData?.password.length < 8) return toast.error('password length should must be 8-digits.');
    if (signupData?.password !== signupData?.confirmPassword)
      return toast.error('password and confirm-password are not same.');

    const hashPassword = HashPassword(signupData.password);
    if (!checkEmptyValue(hashPassword)) {
      dispatch(AuthenticatedUser({ password: hashPassword, auth: true }));
      setSignupData(signupForm);
      onClose(); // close this modal
      signup(); // for create and import wallet account
    }
  };

  return (
    <Modal show={signupModal} size="lg" popup={true} onClose={onClose} className="modals">
      <Modal.Header />
      <Modal.Body>
        <div>
          <div className="my-4">
            <h1 className="p-2 font-bold text-center text-3xl font-sans">Create Password</h1>
            <p className="text-center text-sm font-mono">
              this password will unlock your bsv-wallet only on this device.
            </p>
          </div>
          <form className="p-2 flex flex-col gap-4" onSubmit={handleSignupSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="input1" />
              </div>
              <TextInput
                id="input1"
                type="password"
                placeholder="password"
                name="password"
                required={true}
                onChange={onChange}
                value={signupData?.password}
                autoComplete="off"
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="input2" />
              </div>
              <TextInput
                id="input2"
                type="password"
                placeholder="confirm password"
                name="confirmPassword"
                required={true}
                onChange={onChange}
                value={signupData?.confirmPassword}
                autoComplete="off"
              />
            </div>

            <Button type="submit" className="my-2" gradientMonochrome="info" pill={true}>
              Create Password
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

SignUpPage.propTypes = {
  signupModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  signup: PropTypes.func.isRequired,
};

export default SignUpPage;
