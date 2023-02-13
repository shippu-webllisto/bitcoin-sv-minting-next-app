import React, { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'flowbite-react';
import { toast } from 'react-toastify';

import Styles from './nft-list.module.css';
import { pinataForData, pinataForIpfs } from '@/services/pinata-ipfs';
import { AddNft, UpdateNfts } from '@/store/features/nfts/index';
// import { satoshiToBsvConversion } from '@/helpers/amountConversion';
// import { bsvToUsd } from '@/utils/bsvToUsd';
import PopupModal from '@/components/ui/popup-modal/index';
import { checkEmptyValue } from '@/utils/checkEmptyValue';

const mintForm = {
  name: '',
  description: '',
  symbol: '',
  supply: '',
};

const NftList = () => {
  const { walletAddress } = useSelector((state) => state.walletConnect);
  const { nfts } = useSelector((state) => state.nfts);
  const dispatch = useDispatch();

  const [mintData, setMintData] = useState(mintForm);
  const [getFile, setGetFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalMint, setIsModalMint] = useState(false);

  const onChange = (e) => {
    setMintData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const opneMintModal = () => {
    setIsModalMint((prev) => !prev);
  };

  const handleMintNFT = async (e) => {
    e.preventDefault();
    if (checkEmptyValue(walletAddress)) return toast.error('Invalid Wallet Address!');
    if (
      checkEmptyValue(mintData.name) ||
      checkEmptyValue(mintData.description) ||
      checkEmptyValue(mintData.symbol) ||
      checkEmptyValue(mintData.supply) ||
      !getFile
    )
      return toast.info('please fill all the required fileds!!');
    if (Number(mintData.supply) <= 0) return toast.info('supply must be 1 or more!!');
    try {
      setIsLoading(true);
      let form = new FormData();
      form.append('file', getFile);
      const { IpfsHash } = await pinataForIpfs(form);
      const getDatafromPinata = await pinataForData({
        walletAddress: walletAddress,
        name: mintData.name,
        description: mintData.description,
        symbol: mintData.symbol,
        supply: Number(mintData.supply),
        image: `https://ipfs.io/ipfs/${IpfsHash}`,
      });
      if (IpfsHash && getDatafromPinata) {
        setIsLoading(true);
        // const getData = await SafeMint(params.collection, walletAddress, walletAddress, getDatafromPinata.IpfsHash);
        // if (getData) {
        dispatch(
          AddNft({
            walletAddress: walletAddress,
            name: mintData.name,
            description: mintData.description,
            symbol: mintData.symbol,
            supply: Number(mintData.supply),
            image: `https://ipfs.io/ipfs/${IpfsHash}`,
          }),
        );
        setIsLoading(false);
        setMintData(mintForm);
        setIsModalMint(false);
        // }
      }
    } catch (error) {
      setIsLoading(false);
      return toast.error(error.message);
    }
  };

  return (
    <>
      <div className={`flex justify-center my-2 ${Styles.nft_list}`}>
        <div className="rounded-xl shadow-lg bg-white w-full">
          <div className="flex flex-row justify-between bg-[#527195] text-white font-bold p-1 rounded-t-xl ">
            <h1 className="ml-2">NFTs</h1>
            <button className="flex flex-row justify-center cursor-pointer" onClick={opneMintModal}>
              Mint
              <Image
                className="rounded-full mx-2 cursor-pointer mt-0.5"
                src="/assets/svgs/add-icon.svg"
                alt="add-nft-logo"
                title="mint-nft"
                width={20}
                height={20}
                priority
              />
            </button>
          </div>
          <div className="p-6">
            {nfts.length === 0 ? (
              <h3 className="text-center font-mono text-gray-500">Empty</h3>
            ) : (
              nfts?.map((item, i) => {
                return (
                  <React.Fragment key={i}>
                    <NFTs item={item} />
                  </React.Fragment>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Mint NFT  */}
      <Modal show={isModalMint} size="lg" popup={true} onClose={() => setIsModalMint(false)} className="modals">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Mint NFT</h1>
            </div>
            <form onSubmit={handleMintNFT} className="">
              <div className="form-group mb-3">
                <div className="my-2">
                  <label htmlFor="id_name" className="sr-only">
                    Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="id_name"
                      className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                      placeholder="Name"
                      onChange={onChange}
                      name="name"
                      value={mintData?.name}
                      required
                    />
                  </div>
                </div>

                <div className="my-2">
                  <label htmlFor="id_desc" className="sr-only">
                    Description
                  </label>
                  <div className="relative">
                    <input
                      id="id_desc"
                      type="text"
                      className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                      placeholder="Description"
                      onChange={onChange}
                      name="description"
                      value={mintData?.description}
                      required
                    />
                  </div>
                </div>

                <div className="my-2">
                  <label htmlFor="id_symbol" className="sr-only">
                    Symbol
                  </label>
                  <div className="relative">
                    <input
                      id="id_symbol"
                      type="text"
                      className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                      placeholder="Symbol"
                      onChange={onChange}
                      name="symbol"
                      value={mintData?.symbol}
                      required
                    />
                  </div>
                </div>

                <div className="my-2">
                  <label htmlFor="id_supply" className="sr-only">
                    Supply
                  </label>
                  <div className="relative">
                    <input
                      id="id_supply"
                      type="number"
                      className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                      placeholder="Supply"
                      onChange={onChange}
                      name="supply"
                      value={mintData?.supply}
                      required
                    />
                  </div>
                </div>

                <div className="my-2">
                  <div className="relative">
                    <input
                      id="nft_logo"
                      title="select you NFT"
                      type="file"
                      className="w-full rounded-lg border-gray-200 p-4 pr-12 text-sm shadow-sm"
                      accept="image/*"
                      placeholder="choose nft image"
                      onChange={(e) => setGetFile(e.target.files[0])}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                  </div>
                </div>

                {/* <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        aria-hidden="true"
                        className="w-10 h-10 mb-3 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF</p>
                    </div>

                    <input
                      id="dropzone-file"
                      type="file"
                      title="select you NFT"
                      className="hidden"
                      accept="image/*"
                      placeholder="choose nft image"
                      onChange={(e) => setGetFile(e.target.files[0])}
                      required
                    />
                  </label>
                </div> */}
              </div>

              <button
                type="submit"
                className="w-full inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Mint'}
              </button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
};

const emptyForm = {
  to: '',
  supply: '',
};

export function NFTs({ item }) {
  const { nfts } = useSelector((state) => state.nfts);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  // const [usd, setUsd] = useState(0);
  const [isModalBurn, setIsModalBurn] = useState(false);
  const [isModalTransfer, setIsModalTransfer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transferData, setTransferData] = useState(emptyForm);

  // useEffect(() => {
  //   (async () => {
  //     const usdPrice = await bsvToUsd(satoshiToBsvConversion(item.amount));
  //     setUsd(usdPrice);
  //   })();
  // }, [item.amount]);

  const onChange = (e) => {
    setTransferData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openBurnModal = () => {
    setIsModalBurn((prev) => !prev);
  };
  const openTranferModal = () => {
    setIsModalTransfer((prev) => !prev);
  };

  const handleOpen = () => {
    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setOpen((prev) => !prev);
  };

  const handleBurnNft = (Name) => {
    try {
      setIsLoading(true);
      const updatedData = nfts?.filter((el) => el.name !== Name);
      if (updatedData) {
        dispatch(UpdateNfts(updatedData));
        setIsLoading(false);
        openBurnModal();
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  const handleTransferNft = () => {
    if (checkEmptyValue(transferData.to)) return toast.error('please, fill all required fields!');
    try {
      setIsLoading(true);
      const updatedData = nfts?.filter((el) => el.name !== item.name);
      if (updatedData) {
        dispatch(UpdateNfts(updatedData));
        setIsLoading(false);
        setTransferData(emptyForm);
        openTranferModal();
      }
    } catch (error) {
      return toast.error(error.message);
    }
  };

  return (
    <>
      <div className="bg-gray-200 rounded-lg my-2">
        <div className="flex justify-between p-4">
          <div className="flex flex-row justify-between">
            <Image
              className="rounded-full"
              src={item?.image}
              alt="nft-logo"
              title="nft"
              width={40}
              height={40}
              priority
            />
            <h2 className="text-center font-mono font-bold mt-4 ml-2">{item?.name}</h2>
          </div>
          <div className="text-lg text-bold flex flex-row justify-between">
            <div className="flex flex-col text-end mx-2">
              {/* <p className="">{item?.amount?.toFixed(0)}</p>
              <p className="">$ {usd?.toFixed(0)}</p> */}
              <p className="font-mono text-md">supply:{item?.supply}</p>
            </div>{' '}
            {open ? (
              <Image
                className="rounded-full cursor-pointer"
                src="/assets/svgs/arrow-up.svg"
                alt="arrow-up"
                title="arrow-up"
                width={20}
                height={20}
                priority
                onClick={handleOpen}
              />
            ) : (
              <Image
                className="rounded-full cursor-pointer"
                src="/assets/svgs/arrow-down.svg"
                alt="arrow-down"
                title="arrow-down"
                width={20}
                height={20}
                priority
                onClick={handleOpen}
              />
            )}
          </div>
        </div>

        {open && (
          <div
            className={`${Styles.btn_group} flex  gap-4 justify-center px-8 py-2 font-semibold  dark:bg-gray-100 dark:text-gray-800 hover:border-red-600`}
          >
            <button
              type="button"
              title="burn nft"
              className={`flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border border-red-900 hover:border-red-600 btn-home ${Styles.btn} bg-red-100`}
              onClick={openBurnModal}
            >
              <Image className="mr-2" src="/assets/svgs/fire.svg" alt="burn-logo" width={20} height={20} />
              Burn
            </button>
            <button
              type="button"
              title="transfer nft"
              className={`flex justify-center px-8 py-2 font-semibold rounded-full dark:bg-gray-100 dark:text-gray-800 border border-green-900   hover:border-red-600 btn-home ${Styles.btn} bg-green-100`}
              onClick={openTranferModal}
            >
              <Image className="mr-2" src="/assets/svgs/transfer-nft.svg" alt="transfer-logo" width={20} height={20} />
              Transfer
            </button>
          </div>
        )}
      </div>

      {/* burn nft  */}
      <PopupModal
        popup={isModalBurn}
        handlePopup={() => setIsModalBurn(false)}
        title="Burn NFT"
        description="are you sure, do you want to burn your current NFT?"
        onClick={() => handleBurnNft(item?.name)}
      />

      {/* transfer nft  */}
      <Modal show={isModalTransfer} size="lg" popup={true} onClose={() => setIsModalTransfer(false)} className="modals">
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Transfer NFT</h1>
            </div>

            <form onSubmit={handleTransferNft} className="">
              <div className="form-group mb-3">
                <label htmlFor="transfere_nft" className="form-label inline-block mb-2 text-gray-700"></label>
                <input
                  type="text"
                  className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                  id="transfere_nft"
                  placeholder="address"
                  onChange={onChange}
                  name="to"
                  value={transferData?.to}
                  required
                />
              </div>
              <button
                type="submit"
                className="text-center w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
              >
                {isLoading ? 'Loading...' : 'Transfer'}
              </button>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </>
  );
}

NFTs.propTypes = {
  item: PropTypes.object.isRequired,
};

export default NftList;
