import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addAccount: [],
};

const addNewAccount = createSlice({
  name: 'addAccount',
  initialState,
  reducers: {
    AddAccount: (state, action) => {
      state.addAccount = [...state.addAccount, action.payload];
    },
    UpdateAccount: (state, action) => {
      state.addAccount = action.payload;
    },
    ResetAddAccount: (state) => {
      state.addAccount = [];
    },
  },
});

export const { AddAccount, ResetAddAccount, UpdateAccount } = addNewAccount.actions;

export default addNewAccount.reducer;
