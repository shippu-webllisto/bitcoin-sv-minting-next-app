import React, { useState } from 'react';
import Image from 'next/image';
import Styles from './token-list.module.css';
import Addtoken from '@/components/ui/add-token/index';

const TokenList = () => {
  const [popup, setPopup] = useState(false);

  const handleAddToken = (e) => {
    e.preventDefault();
    setPopup((prev) => !prev);
  };

  return (
    <>
      <div className={`flex justify-center my-2 ${Styles.token_list}`}>
        <div className="rounded-xl shadow-lg bg-white w-full">
          <div className="flex flex-row justify-between bg-[#527195] text-white font-bold p-1 rounded-t-xl ">
            <h1 className="ml-2">Tokens</h1>
            <Image
              className="rounded-full mr-2 cursor-pointer"
              src="/assets/svgs/add-icon.svg"
              alt="logo"
              width={20}
              height={20}
              priority
              onClick={handleAddToken}
            />
          </div>

          <div className="p-6"></div>
        </div>
      </div>

      <Addtoken popup={popup} onClick={() => setPopup(false)} />
    </>
  );
};

export default TokenList;
