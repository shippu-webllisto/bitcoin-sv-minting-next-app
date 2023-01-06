import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { ComparingPassword } from '@/helpers/bcryptjs';
import { endpoints } from '@/routes/endpoints';

function LoginPage({ loginModal, onClose, password }) {
  const router = useRouter();
  const [loginData, setLoginData] = useState('');

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (checkEmptyValue(loginData)) return toast.error('please, fill the required filed.');
    if (checkEmptyValue(password)) return toast.error('invalid password');
    const getPassword = ComparingPassword(loginData, password);
    if (getPassword) {
      setLoginData('');
      onClose();
      return router.push(endpoints.home);
    } else {
      return toast.error('Invalid Password!!');
    }
  };

  return (
    <Modal show={loginModal} size="lg" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div>
          <h1 className="mb-5 text-center text-3xl font-sans font-bold">Welcome back!</h1>
          <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" />
              </div>
              <TextInput
                id="password"
                type="password"
                placeholder="password"
                name="password"
                required={true}
                onChange={(e) => setLoginData(e.target.value)}
                value={loginData}
                autoComplete="new-password"
              />
            </div>

            <Button type="submit" className="my-2" color="success" pill={true}>
              UNLOCK
            </Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

LoginPage.propTypes = {
  loginModal: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
};

export default LoginPage;
