import React from 'react';
// import LoginPage from '@/components/common/login/index';
import dynamic from 'next/dynamic';
const Login = dynamic(() => import('@/components/common/login/index'), { ssr: false });

function LoginPage() {
  return (
    <>
      <Login />
    </>
  );
}

export default LoginPage;
