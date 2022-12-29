import React from 'react';
import Image from 'next/image';
import { getShortAddress } from '@/utils/getShortAddress.js';
import Styles from './nft-list.module.css';

const Array = [
  { walletAddress: 'mpEr5y6vatNnxKqAgPVykmyFEG3K4nFmoY', avatar: '/assets/svgs/nft_cion.svg', account: 'NFT-1' },
  { walletAddress: 'mpEr5y6vatNnxKqAgPVykmyFEG3K4nFmoY', avatar: '/assets/svgs/nft_cion.svg', account: 'NFT-2' },
  { walletAddress: 'mpEr5y6vatNnxKqAgPVykmyFEG3K4nFmoY', avatar: '/assets/svgs/nft_cion.svg', account: 'NFT-3' },
];

const NftList = () => {
  return (
    <div className={`flex justify-center my-2 ${Styles.nft_list}`}>
      <div className="rounded-xl shadow-lg bg-white w-full">
        <h1 className="bg-[#527195] text-white font-bold p-1 rounded-t-xl ">
          <span className="ml-3">NFTs</span>
        </h1>

        <div className="p-6">
          {Array.length === 0 ? (
            <h3 className="text-center font-mono ">Empty</h3>
          ) : (
            Array?.map((item, i) => {
              return (
                <div key={i} className="hover:bg-gray-200">
                  <button
                    className="flex justify-between p-2 text-sm text-gray-600 text-center my-2 w-full"
                    // onClick={handleOpenAccount}
                  >
                    <Image
                      className="rounded-full mx-auto w-10 ml-8 border text-center mt-2"
                      src={item?.avatar}
                      alt="logo"
                      width={30}
                      height={30}
                    />
                    <div className="flex flex-col justify-end mx-8">
                      <span className="font-bold text-sm">{item?.account}</span>
                      <span className="font-mono">{getShortAddress(item?.walletAddress)}</span>
                    </div>
                  </button>
                  <hr />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NftList;
