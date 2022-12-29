import PropTypes from 'prop-types';
import { Button, Label, Modal, TextInput } from 'flowbite-react';

const InputPopupModal = ({ popup, handlePopup, title, description, placeholder, inputValue, onChange, onSubmit }) => {
  return (
    <Modal show={popup} size="md" popup={true} onClose={handlePopup}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-3xl font-bold text-gray-900 dark:text-gray-400">{title}</h3>
          <p className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{description}</p>

          <form className="flex flex-col gap-4" onSubmit={onSubmit}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="input1" />
              </div>
              <TextInput
                id="input1"
                type="text"
                placeholder={placeholder}
                value={inputValue}
                required={true}
                onChange={(e) => onChange(e.target.value)}
              />
            </div>

            <Button type="submit">Yes, Im sure</Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

InputPopupModal.propTypes = {
  popup: PropTypes.bool.isRequired,
  handlePopup: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default InputPopupModal;
