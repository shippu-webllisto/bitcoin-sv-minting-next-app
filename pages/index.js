import React from 'react';
// import Home from '@/containers/home/index';
import dynamic from 'next/dynamic';
const Home = dynamic(() => import('@/containers/home/index'), { ssr: false });

const HomePage = () => {
  return (
    <>
      <Home />
    </>
  );
};

export default HomePage;
