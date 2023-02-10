import axios from 'axios';
import { toast } from 'react-toastify';
import { config } from '@/config/index';

const pinataApiKey = config.pinataApiKey;
const pinataSecretApiKey = config.pinataSecretApiKey;

const instance = axios.create();

export const pinataForIpfs = async (data) => {
  try {
    delete instance.defaults.headers.common['Authorization'];

    const xhr = await axios.request({
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
      url: `https://api.pinata.cloud/pinning/pinFileToIPFS`,
      data,
    });
    if (xhr.status === 200) return xhr.data;
  } catch (error) {
    return toast.error(error.message);
  }
};

export const pinataForData = async (data) => {
  try {
    delete instance.defaults.headers.common['Authorization'];

    const xhr = await axios.request({
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretApiKey,
      },
      url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
    });
    if (xhr.status === 200) return xhr.data;
  } catch (error) {
    return toast.error(error.message);
  }
};
