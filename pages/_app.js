/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider, useSelector } from 'react-redux';

import { store } from '@/store/index';
import '../styles/globals.css';
import Navbar from '@/layouts/navbar/index';
import Footer from '@/layouts/footer/index';
import { endpoints } from '@/routes/endpoints';
import { checkEmptyValue } from '@/utils/checkEmptyValue';

function MyApp({ Component, pageProps }) {
  const [initialRenderComplete, setInitialRenderComplete] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    setInitialRenderComplete(true);
    import('flowbite/dist/flowbite');
  }, []);

  if (!initialRenderComplete) {
    return null;
  } else {
    return (
      <>
        <React.StrictMode>
          <Provider store={store}>
            <App>
              <Navbar />
              <Head>
                <title>bitcoin-sv-minting-app</title>
              </Head>
              <Component key={router.asPath} {...pageProps} />
              <ToastContainer theme="colored" autoClose={2000} hideProgressBar={true} />
              <Footer />
            </App>
          </Provider>
        </React.StrictMode>
      </>
    );
  }
}

export const App = ({ children }) => {
  const router = useRouter();
  const WalletConnect = useSelector((state) => state.walletConnect);

  useEffect(() => {
    // protected routes
    if (checkEmptyValue(WalletConnect.walletAddress)) {
      router.replace(endpoints.connect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [WalletConnect.walletAddress]);

  return children;
};

export default MyApp;
