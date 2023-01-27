import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  walletAddress: '',
  mnemonic: '',
  privateKey: '',
  network: '',
  bsvAmount: 0,
  avatar: '',
  account: '',
  transcations: [],
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
      state.transcations = action.payload.transcations;
    },
    ResetWallet: (state) => {
      state.walletAddress = '';
      state.mnemonic = '';
      state.privateKey = '';
      state.network = '';
      state.bsvAmount = 0;
      state.avatar = '';
      state.account = '';
      state.transcations = [];
    },
    AddTranscation: (state, action) => {
      state.transcations = [...state.transcations, action.payload];
    },
    DeletedTranscation: (state, action) => {
      state.transcations = state.transcations?.filter((item) => item.transactionHash !== action.payload);
    },
    UpdateTranscationsHistory: (state, action) => {
      state.transcations = action.payload;
    },
    UpdateBsvBalance: (state, action) => {
      state.bsvAmount = action.payload;
    },
  },
});

export const {
  ConnetedWallet,
  ResetWallet,
  AddTranscation,
  DeletedTranscation,
  UpdateTranscationsHistory,
  UpdateBsvBalance,
} = WalletConnect.actions;

export default WalletConnect.reducer;
