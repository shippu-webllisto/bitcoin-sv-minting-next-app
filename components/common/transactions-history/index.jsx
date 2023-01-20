import { Table } from 'flowbite-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

import Styles from './transactions-history.module.css';
import { CopyClipboard } from '@/helpers/CopyClipboard.js';
import { getShortAddress } from '@/utils/getShortAddress';

export default function TranscationsHistory() {
  const { walletAddress } = useSelector((state) => state.walletConnect);
  const { history } = useSelector((state) => state.history);

  const handleCopyText = (TransactionHash) => {
    CopyClipboard(TransactionHash);
    return toast.success('Copied Transaction Hash');
  };

  return (
    <>
      <div className={`flex justify-center my-2 ${Styles.history}`}>
        <div className="rounded-xl shadow-lg bg-white w-full">
          <div className="flex flex-row justify-between bg-[#527195] text-white font-bold p-1 rounded-t-xl ">
            <h1 className="ml-2">Transactions</h1>
          </div>
          <div className="">
            {history.length === 0 ? (
              <h6 className="text-center text-gray-500 p-6">Empty</h6>
            ) : (
              <div className="p-1">
                <Table hoverable={true} className="w-full">
                  <Table.Head className="bg-slate-300 text-center">
                    <Table.HeadCell>Transaction Hash</Table.HeadCell>
                    <Table.HeadCell>Status</Table.HeadCell>
                    <Table.HeadCell>Block Check</Table.HeadCell>
                    <Table.HeadCell>Block</Table.HeadCell>
                    <Table.HeadCell>Fee Paid</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {history?.map((item, i) => {
                      return (
                        <Table.Row className="bg-gray-50 dark:border-gray-700 dark:bg-gray-800 text-center" key={i}>
                          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white flex flex-row justify-around">
                            <Image
                              className="cursor-pointer mr-2"
                              src="/assets/svgs/copy-icon.svg"
                              alt="copy-logo"
                              title="copy hash"
                              width={20}
                              height={20}
                              priority
                              onClick={() => handleCopyText(item?.transactionHash)}
                            />
                            {getShortAddress(item?.transactionHash)}
                          </Table.Cell>
                          <Table.Cell>
                            {item?.status === 'confirmed' ? (
                              <span className="border-2 border-green-400 bg-green-200 p-2 rounded-lg text-black">
                                Confirmed
                              </span>
                            ) : (
                              <span className="border-2 bg-yellow-300  p-2 rounded-lg text-black">Pending</span>
                            )}
                          </Table.Cell>
                          <Table.Cell className="text-black flex justify-center items-center">
                            <a
                              href={`https://blockcheck.info/transaction/detail?tx=${item?.transactionHash}`}
                              target="_blank"
                              rel="noreferrer"
                              title="check transaction hash"
                            >
                              <Image src="/assets/svgs/link-logo.svg" alt="block-check-link" width={20} height={20} />
                            </a>
                          </Table.Cell>
                          <Table.Cell className="text-black">{item?.block}</Table.Cell>
                          <Table.Cell className="text-black">{item?.feePaid} BSV</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            )}
            {/* check more transaction on block check  */}
            <a
              className="flex flex-row justify-center items-center p-1 border border-black rounded-lg my-4 bg-slate-200 hover:bg-gray-300 w-[50%] mx-auto"
              href={`https://blockcheck.info/address/detail?address=${walletAddress}`}
              target="_blank"
              rel="noreferrer"
              title="check more transaction history"
            >
              <Image src="/assets/svgs/link-logo.svg" alt="block-check-link" width={15} height={15} />
              <span className="ml-2 text-md text-black">check more...</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
