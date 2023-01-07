/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

import { store } from '@/store/index';
import '../styles/globals.css';
import { endpoints } from '@/routes/endpoints';
import { checkEmptyValue } from '@/utils/checkEmptyValue';
// import Navbar from '@/layouts/navbar/index';
// import Footer from '@/layouts/footer/index';
const Navbar = dynamic(() => import('@/layouts/navbar/index.jsx'), { ssr: false });
const Footer = dynamic(() => import('@/layouts/footer/index.jsx'), { ssr: false });

export const App = ({ children }) => {
  const router = useRouter();
  const { password, auth } = useSelector((state) => state.authentication);

  useEffect(() => {
    // protected routes
    if (checkEmptyValue(password) && !auth) {
      router.replace(endpoints.connectWallet);
    } else {
      router.replace(endpoints.login);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return children;
};

function MyApp({ Component, pageProps }) {
  // const [initialRenderComplete, setInitialRenderComplete] = React.useState(false);
  const router = useRouter();

  useEffect(() => {
    // setInitialRenderComplete(true);
    require('flowbite/dist/flowbite');
  }, []);

  // if (!initialRenderComplete) {
  //   return null;
  // } else {
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
  // }
}

export default MyApp;
