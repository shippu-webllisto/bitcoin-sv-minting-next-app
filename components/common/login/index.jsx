import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Card, Label, TextInput } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { ComparingPassword } from '@/helpers/bcryptjs';
import { endpoints } from '@/routes/endpoints';
import { AuthenticatedUser } from '@/store/features/authentication/index';
import ForgotPassword from '@/components/ui/forgot-password/index';

function Login() {
  const router = useRouter();
  const { password } = useSelector((state) => state.authentication);
  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState('');
  const [forgotModal, setForgotModal] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (checkEmptyValue(loginData)) return toast.error('please, fill the required filed.');
    if (checkEmptyValue(password)) return toast.error('Invalid Password!!');
    const getPassword = ComparingPassword(loginData, password);
    if (getPassword) {
      // remove auth for a week(7*24*60*60)
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      setTimeout(() => {
        dispatch(AuthenticatedUser({ password: password, auth: false }));
        router.replace(endpoints.login);
      }, oneWeek);

      dispatch(AuthenticatedUser({ password, auth: true }));
      setLoginData('');
      return router.push(endpoints.home);
    } else {
      return toast.error('Invalid Password!!');
    }
  };

  const handleResetWalletModal = () => {
    setForgotModal((prev) => !prev);
  };

  return (
    <>
      <div className="flex justify-center items-center mt-32">
        <Card className="w-96 bg-gray-50">
          <div className="my-5 text-center ">
            <h1 className="text-3xl font-sans font-bold">Welcome back !</h1>
            <p className="font-mono">to bsv wallet</p>
          </div>
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
          <div className="text-center my-4">
            <button
              className="border-2 rounded-full p-2 px-4 hover:bg-orange-800 hover:text-white hover:border-white"
              type="button"
              onClick={handleResetWalletModal}
            >
              Forgot Password ?
            </button>
          </div>
        </Card>
      </div>

      {/* forgot password - modal */}
      <ForgotPassword forgotModal={forgotModal} onClose={() => setForgotModal(false)} />
    </>
  );
}

export default Login;
