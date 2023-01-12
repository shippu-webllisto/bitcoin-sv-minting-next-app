import React from 'react';
// import LoginPage from '@/components/common/login/index';
import dynamic from 'next/dynamic';
import { App } from '../_app';
const Login = dynamic(() => import('@/components/common/login/index'), { ssr: false });

function LoginPage() {
  return (
    <App>
      <Login />
    </App>
  );
}

export default LoginPage;
