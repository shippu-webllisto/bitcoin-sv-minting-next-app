import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'flowbite-react';

const PopupModal = ({ popup, handlePopup, title, description, onClick }) => {
  return (
    <Modal show={popup} size="md" popup={true} onClose={handlePopup}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-900 dark:text-gray-400">{title}</h3>
          <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{description}</p>
          <div className="flex justify-center gap-4">
            <Button gradientDuoTone="purpleToBlue" onClick={onClick}>
              Yes, Im sure
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

PopupModal.propTypes = {
  popup: PropTypes.bool.isRequired,
  handlePopup: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PopupModal;
