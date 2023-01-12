import React from 'react';
// import Connect from '@/containers/connect/index';
import dynamic from 'next/dynamic';
const Connect = dynamic(() => import('@/containers/connect/index'), { ssr: false });

const ConnectPage = () => {
  return (
    <>
      <Connect />
    </>
  );
};

export default ConnectPage;
