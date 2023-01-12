import React from 'react';
// import Home from '@/containers/home/index';
import dynamic from 'next/dynamic';
import { App } from './_app';
const Home = dynamic(() => import('@/containers/home/index'), { ssr: false });

const HomePage = () => {
  return (
    <App>
      <Home />
    </App>
  );
};

export default HomePage;
