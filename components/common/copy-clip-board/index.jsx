import PropTypes from 'prop-types';
import Image from 'next/image';
import { toast } from 'react-toastify';

import { CopyClipboard } from '@/helpers/CopyClipboard.js';
import { getShortAddress } from '@/utils/getShortAddress.js';

const CopyClipBoard = ({ walletAddress, isSort = true }) => {
  const handleCopyText = (e) => {
    e.preventDefault();

    CopyClipboard(walletAddress);
    return toast.success('copied');
  };
  return (
    <div
      className="flex justify-center flex-row space-x-12 hover:bg-gray-200 my-2 p-1 rounded-lg cursor-pointer"
      onClick={handleCopyText}
    >
      {isSort ? (
        <h3 className="text-center">{getShortAddress(walletAddress)}</h3>
      ) : (
        <h3 className="text-center">{walletAddress}</h3>
      )}
      <Image className="" src="/assets/svgs/copy-icon.svg" alt="cpoy-clip-logo" width={15} height={15} />
    </div>
  );
};

CopyClipBoard.propTypes = {
  walletAddress: PropTypes.string.isRequired,
  isSort: PropTypes.bool,
};

export default CopyClipBoard;
