import { useState } from 'react';
import { Button, Modal } from 'flowbite-react';
import PropTypes from 'prop-types';
import { QrReader } from 'react-qr-reader';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

import { checkEmptyValue } from '@/utils/checkEmptyValue';
import { AddAccount } from '@/store/features/add-account/index';
import { Encryption } from '@/helpers/encryptionAndDecryption';
import { ImportAccountData } from '@/services/web3-service/bsv';
import { ConnetedWallet } from '@/store/features/wallet-connect/index';
import { endpoints } from '@/routes/endpoints';
import { AuthenticatedUser } from '@/store/features/authentication/index';
// import { mobileDetect } from '@/helpers/mobileDetected';

const avatar = 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-vector-avatar-icon-png-image_695765.jpg';

function QRScanner({ show, onClose, title, description }) {
  const { addAccount } = useSelector((state) => state.addAccount);
  const { password } = useSelector((state) => state.authentication);
  const router = useRouter();
  const dispatch = useDispatch();

  const [selected, setSelected] = useState('environment');
  const [getError, setGetError] = useState('');
  const [data, setData] = useState('');
  // const [stop, setStop] = useState(true);

  const handleOnClose = () => {
    // setStop(false);
    setGetError('');
    setData('');
    onClose();
    // router.reload();
  };

  // const constraints = {
  //   facingMode: 'environment',
  //   // facingMode: { exact: mobileDetect() ? 'environment' : 'user' },
  // };

  const onResult = (result, error) => {
    if (data === result?.text) return;
    if (result) {
      setData(result?.text);
      // setStop(false);
    }
    if (error) {
      setGetError(error.message);
      // setStop(false);
    }
  };

  const handleScannedImportAccount = async () => {
    if (checkEmptyValue(data)) return toast.error('Invalid Mnemonic key!');
    try {
      const encryptedMnemonicKey = Encryption(data?.toLowerCase());
      // mnemonic account already exist and
      const existMnemonicKey = addAccount?.find((item) => item.mnemonic === encryptedMnemonicKey);
      if (existMnemonicKey?.mnemonic === encryptedMnemonicKey) {
        handleOnClose();
        return toast.error('this mnemonic account already exist!!');
      }

      const { getAddress, getBalance, getNetwork } = await ImportAccountData(data, 'mainnet');
      if (
        !checkEmptyValue(encryptedMnemonicKey) &&
        !checkEmptyValue(getAddress) &&
        !checkEmptyValue(getBalance) &&
        !checkEmptyValue(getNetwork)
      ) {
        const count = addAccount.length + 1;
        const _account = `Account-${count}`;
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
        // remove auth for a week(7*24*60*60)
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        setTimeout(() => {
          dispatch(AuthenticatedUser({ password: password, auth: false }));
          router.replace(endpoints.login);
        }, oneWeek);

        setGetError('');
        setData('');
        onClose();
        return router.push(endpoints.home);
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <Modal show={show} size="lg" popup={true} onClose={handleOnClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-400">{title}</h3>
          <p className="text-sm my-4 font-fono text-gray-500 dark:text-gray-400">{description}</p>

          <div className="flex flex-col justify-center items-center p-3 rounded-lg">
            {show && (
              <div className="">
                {/* {checkEmptyValue(data) && ( */}
                <>
                  <div>
                    <select onChange={(e) => setSelected(e.target.value)}>
                      <option value={'environment'}>Back Camera</option>
                      <option value={'user'}>Front Camera</option>
                    </select>
                  </div>
                  <QrReader
                    className="w-72 mx-auto flex justify-center items-center"
                    // constraints={constraints}
                    constraints={{ facingMode: selected }}
                    scanDelay={200}
                    onResult={onResult}
                    style={{ width: '100%' }}
                  />
                </>
                {/* )} */}
              </div>
            )}
            <div className="my-2 break-all">
              {getError && (
                <p className="relative lowercase text-center border-2 border-red-500 bg-red-100 rounded-lg p-2 m-2">
                  {getError}
                </p>
              )}
              {data && (
                <div>
                  <h6 className="font-mono text-center text-gray-600">Your Mnemonic Key</h6>
                  <p className="relative lowercase text-center border-2 border-gray-500 bg-gray-100 rounded-lg p-2 m-2">
                    {data}
                  </p>
                </div>
              )}
            </div>
          </div>
          {/* <Button
            type="button"
            title="Re-Scan"
            className="mt-4 w-full"
            onClick={() => setStop((prev) => !prev)}
            // disabled={checkEmptyValue(data)}
          >
            {stop ? 'Stop Scan' : 'Start Scan'}
          </Button> */}
          <Button
            type="button"
            title="import account"
            gradientDuoTone="purpleToBlue"
            className="mt-4 w-full"
            onClick={handleScannedImportAccount}
            disabled={checkEmptyValue(data)}
          >
            import
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

QRScanner.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default QRScanner;
