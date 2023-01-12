import React from 'react';
// import Connect from '@/containers/connect/index';
import dynamic from 'next/dynamic';
import { App } from '../_app';
const Connect = dynamic(() => import('@/containers/connect/index'), { ssr: false });

const ConnectPage = () => {
  return (
    <App>
      <Connect />
    </App>
  );
};

export default ConnectPage;
