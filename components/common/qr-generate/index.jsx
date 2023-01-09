import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import CopyClipBoard from '../copy-clip-board/index.jsx';

const QRCodeGenerater = ({ walletAddress }) => {
  return (
    <div className="flex text-center justify-center flex-col border rounded-lg p-2 ">
      <h1 className="font-bold">Receive BSV Assets</h1>
      <div className="text-center my-1">
        <QRCode className="inline-block my-2" value={walletAddress} renderAs="canvas" />
      </div>
      <span className="text-center font-mono text-slate-500">or</span>
      <CopyClipBoard walletAddress={walletAddress} />
      <p className="text-sm font-thin">The address can only receive BSV Assets</p>
    </div>
  );
};

QRCodeGenerater.propTypes = {
  walletAddress: PropTypes.string,
};

export default QRCodeGenerater;
