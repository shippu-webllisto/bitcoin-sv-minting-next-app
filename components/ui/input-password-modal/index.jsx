import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { ComparingPassword } from '@/helpers/bcryptjs';
import { checkEmptyValue } from '@/utils/checkEmptyValue';

function InputPasswordModal({ show, onClose, onClick, title, description }) {
  const { password } = useSelector((state) => state.authentication);
  const [checkPassword, setCheckPassword] = useState('');

  function handleSubmitPassword(e) {
    e.preventDefault();
    if (checkEmptyValue(checkPassword) || checkEmptyValue(password)) return toast.error('Invalid Password !!');
    try {
      const getPassword = ComparingPassword(checkPassword, password);
      if (getPassword) {
        setCheckPassword('');
        onClose();
        onClick();
      } else {
        setCheckPassword('');
        return toast.error('Invalid Password !!');
      }
    } catch (error) {
      return toast.error(error.message);
    }
  }

  return (
    <Modal show={show} size="lg" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-400">{title}</h3>
          <p className="text-sm my-4 font-fono text-gray-500 dark:text-gray-400">{description}</p>

          <div className="flex justify-center items-center p-3 rounded-lg mt-8">
            <form className="flex flex-col w-full" onSubmit={handleSubmitPassword}>
              <h1 className="text-center my-2 font-mono text-gray-600">verify your password</h1>
              <TextInput
                className="w-full"
                title="verify your password"
                placeholder="Enter Your Password"
                type="password"
                name="password"
                value={checkPassword}
                onChange={(e) => setCheckPassword(e.target.value)}
                required={true}
              />
              <Button type="submit" className="mt-8 w-[50%] m-auto" color="dark" pill={true}>
                Continue
              </Button>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

InputPasswordModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default InputPasswordModal;
