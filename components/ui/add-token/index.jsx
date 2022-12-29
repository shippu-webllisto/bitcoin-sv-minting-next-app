import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { checkEmptyValue } from '@/utils/checkEmptyValue.js';

const emptyForm = {
  genesis: '',
  codehash: '',
};

const Addtoken = ({ popup, onClick }) => {
  const [addToken, setAddToken] = useState(emptyForm);

  const onChange = (e) => {
    setAddToken((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitToken = (e) => {
    e.preventDefault();
    if (checkEmptyValue(addToken.genesis) || checkEmptyValue(addToken.codehash))
      return toast.error('please, fill the all fields.');

    onClick();
  };

  return (
    <Modal show={popup} size="md" popup={true} onClose={onClick}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-lg font-normal text-gray-900 dark:text-gray-400">Add Token</h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmitToken}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="input1" />
              </div>
              <TextInput
                id="input1"
                type="text"
                placeholder="genesis"
                required={true}
                onChange={onChange}
                name="genesis"
                value={addToken?.genesis}
              />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="input2" />
              </div>
              <TextInput
                id="input2"
                type="text"
                placeholder="codehash"
                required={true}
                onChange={onChange}
                name="codehash"
                value={addToken?.codehash}
              />
            </div>

            <Button type="submit">Yes, Im sure</Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

Addtoken.propTypes = {
  popup: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Addtoken;
