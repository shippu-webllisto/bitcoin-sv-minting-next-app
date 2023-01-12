import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import { CopyClipboard } from '@/helpers/CopyClipboard';

const ExportDataModal = ({ title, data, popup, onClose }) => {
  const handleCopyText = () => {
    CopyClipboard(data);
    return toast.success('copied');
  };

  return (
    <Modal show={popup} size="lg" popup={true} onClose={onClose}>
      <div className="p-4">
        <Modal.Header>{title}</Modal.Header>
        <hr className="my-2" />
        <Modal.Body>
          <div className="flex flex-row justify-around bg-gray-200 border-2 rounded-lg">
            <h3 className="text-center p-2">{data}</h3>
            <Image
              className="rounded p-2 cursor-pointer"
              src="/assets/svgs/copy-icon.svg"
              alt="cpoy-clip-logo"
              width={35}
              height={35}
              onClick={handleCopyText}
            />
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

ExportDataModal.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.string.isRequired,
  popup: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ExportDataModal;
