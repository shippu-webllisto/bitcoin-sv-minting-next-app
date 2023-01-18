import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Button, Label, Modal, TextInput } from 'flowbite-react';

import { checkEmptyValue } from '@/utils/checkEmptyValue.js';
import { AddTokens } from '@/store/features/tokens/index';

const emptyForm = {
  name: '',
  genesis: '',
  codehash: '',
};

const Addtoken = ({ walletAddress, popup, onClose }) => {
  const dispatch = useDispatch();
  const [addToken, setAddToken] = useState(emptyForm);

  const onChange = (e) => {
    setAddToken((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmitToken = (e) => {
    e.preventDefault();
    if (checkEmptyValue(addToken.name) || checkEmptyValue(addToken.genesis) || checkEmptyValue(addToken.codehash))
      return toast.error('please, fill the all fields.');

    dispatch(
      AddTokens({
        walletAddress: walletAddress,
        img: '/assets/svgs/token-logo.svg',
        name: addToken.name,
        genesis: addToken.genesis,
        codehash: addToken.codehash,
      }),
    );

    setAddToken(emptyForm);
    onClose();
  };

  return (
    <Modal show={popup} size="lg" popup={true} onClose={onClose}>
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <h3 className="mb-5 text-2xl font-bold font-mono text-gray-900 dark:text-gray-400">Add Token</h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmitToken}>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="inputname" />
              </div>
              <TextInput
                id="inputname"
                type="text"
                placeholder="token name"
                required={true}
                onChange={onChange}
                name="name"
                value={addToken?.name}
              />
            </div>
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

            <Button type="submit">Add Token</Button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

Addtoken.propTypes = {
  walletAddress: PropTypes.string.isRequired,
  popup: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Addtoken;
