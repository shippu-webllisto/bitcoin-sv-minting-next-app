import React from 'react';
// import Setting from '@/containers/setting/index';
import dynamic from 'next/dynamic';
import { App } from '../_app';
const Setting = dynamic(() => import('@/containers/setting/index'), { ssr: false });

const SettingPage = () => {
  return (
    <App>
      <Setting />
    </App>
  );
};

export default SettingPage;
