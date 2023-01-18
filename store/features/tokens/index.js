import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tokens: [],
};

const addNewTokens = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    AddTokens: (state, action) => {
      state.tokens = [...state.tokens, action.payload];
    },
    UpdateToken: (state, action) => {
      state.tokens = action.payload;
    },
    ResetToken: (state) => {
      state.tokens = [];
    },
  },
});

export const { AddTokens, UpdateToken, ResetToken } = addNewTokens.actions;

export default addNewTokens.reducer;
