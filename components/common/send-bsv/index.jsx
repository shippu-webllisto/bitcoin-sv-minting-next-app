import React, { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { checkEmptyValue } from '@/utils/checkEmptyValue.js';

const emptyForm = {
  to: '',
  amount: '',
};

const SendBsv = ({ walletAddress }) => {
  const [formData, setFormData] = useState(emptyForm);

  const onChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkEmptyValue(walletAddress) || checkEmptyValue(formData.to) || checkEmptyValue(formData.amount))
      return toast.error('please, fill the all required fileds.');
  };

  return (
    <div className="flex justify-center flex-col border rounded-lg bg-gray-50">
      <h1 className="text-center text-2xl font-mono my-2">Send BSV</h1>
      <div className="flex flex-row justify-center">
        <p>
          You are sending <strong>BSV</strong>
        </p>
        <Image
          className="rounded-full ml-2"
          src="/assets/images/Bsv-icon-small.png"
          alt="logo"
          width={24}
          height={20}
        />
      </div>

      <form onSubmit={handleSubmit} className="p-2 m-2 mb-0 bg-gray-100">
        <div className="form-group">
          <label htmlFor="exampleInputEmail2" className="form-label inline-block mb-2 text-gray-700">
            Form
          </label>
          <input
            type="text"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="exampleInputEmail2"
            placeholder="address"
            value={walletAddress}
            disabled
          />
        </div>
        <div className="form-group mb-6">
          <label htmlFor="exampleInputPassword1" className="form-label inline-block mb-2 text-gray-700">
            To
          </label>
          <input
            type="text"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="exampleInputPassword1"
            placeholder="input address"
            onChange={onChange}
            name="to"
            value={formData?.to}
            required
          />
        </div>
        <div className="form-group mb-6">
          <label htmlFor="exampleInputPassword2" className="form-label inline-block mb-2 text-gray-700"></label>
          <input
            type="text"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
            id="exampleInputPassword2"
            placeholder="input amount (unit:BSV)"
            onChange={onChange}
            name="amount"
            value={formData?.amount}
            required
          />
        </div>

        <button
          type="submit"
          className=" w-full px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        >
          Send
        </button>
      </form>
    </div>
  );
};

SendBsv.propTypes = {
  walletAddress: PropTypes.string.isRequired,
};

export default SendBsv;
