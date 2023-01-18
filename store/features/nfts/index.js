import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nfts: [],
};

const addNfts = createSlice({
  name: 'nfts',
  initialState,
  reducers: {
    AddNft: (state, action) => {
      state.nfts = [...state.nfts, action.payload];
    },
    UpdateNfts: (state, action) => {
      state.nfts = action.payload;
    },
    ResetNfts: (state) => {
      state.nfts = [];
    },
  },
});

export const { AddNft, UpdateNfts, ResetNfts } = addNfts.actions;

export default addNfts.reducer;
