/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import '../styles/globals.css';
import { store } from '@/store/index';
import { endpoints } from '@/routes/endpoints';
import { checkEmptyValue } from '@/utils/checkEmptyValue';
// import Navbar from '@/layouts/navbar/index';
// import Footer from '@/layouts/footer/index';
const Navbar = dynamic(() => import('@/layouts/navbar/index.jsx'), { ssr: false });
const Footer = dynamic(() => import('@/layouts/footer/index.jsx'), { ssr: false });

export const App = ({ children }) => {
  const router = useRouter();
  const { password, auth } = useSelector((state) => state.authentication);
  const { mnemonic } = useSelector((state) => state.walletConnect);

  // protected routes
  useEffect(() => {
    if (checkEmptyValue(mnemonic)) {
      router.push(endpoints.connectWallet);
    } else if (!checkEmptyValue(password) && !auth) {
      router.push(endpoints.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    require('flowbite/dist/flowbite');
  }, []);

  return (
    <>
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
    </>
  );
}

export default MyApp;
