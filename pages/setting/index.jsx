import React from 'react';
// import Setting from '@/containers/setting/index';
import dynamic from 'next/dynamic';
const Setting = dynamic(() => import('@/containers/setting/index'), { ssr: false });

const SettingPage = () => {
  return (
    <>
      <Setting />
    </>
  );
};

export default SettingPage;
