import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';
import Image from 'next/image';
import { toast } from 'react-toastify';
import QRCode from 'qrcode.react';

import { CopyClipboard } from '@/helpers/CopyClipboard';

const ExportDataModal = ({ title, data, popup, onClose, qrText }) => {
  const handleCopyText = () => {
    CopyClipboard(data);
    return toast.success('copied');
  };

  return (
    <Modal show={popup} size="lg" popup={true} onClose={onClose} className="modals">
      <div className="p-4">
        <Modal.Header>{title}</Modal.Header>
        <Modal.Body>
          <div className="flex text-center justify-center flex-col border rounded-lg p-2 ">
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
            <p className="mt-2 text-center font-mono text-gray-500">or</p>
            <div className="text-center my-1">
              <QRCode className="inline-block my-2" value={data} renderAs="canvas" />
              <p className="text-center text-gray-500">{qrText}</p>
            </div>
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
  qrText: PropTypes.string.isRequired,
};

export default ExportDataModal;
