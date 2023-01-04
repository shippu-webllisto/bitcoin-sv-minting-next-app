import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  walletAddress: '',
  mnemonic: '',
  privateKey: '',
  network: '',
  bsvAmount: 0,
  avatar: '',
  account: '',
};

const WalletConnect = createSlice({
  name: 'walletConnect',
  initialState,
  reducers: {
    ConnetedWallet: (state, action) => {
      state.walletAddress = action.payload.walletAddress;
      state.mnemonic = action.payload.mnemonic;
      state.privateKey = action.payload.privateKey;
      state.network = action.payload.network;
      state.bsvAmount = action.payload.bsvAmount;
      state.avatar = action.payload.avatar;
      state.account = action.payload.account;
    },
    ResetWallet: (state) => {
      state.walletAddress = '';
      state.mnemonic = '';
      state.privateKey = '';
      state.network = '';
      state.bsvAmount = 0;
      state.avatar = '';
      state.account = '';
    },
  },
});

export const { ConnetedWallet, ResetWallet } = WalletConnect.actions;

export default WalletConnect.reducer;
