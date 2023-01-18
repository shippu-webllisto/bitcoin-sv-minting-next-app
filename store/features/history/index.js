import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  history: [],
};

const History = createSlice({
  name: 'transcations_history',
  initialState,
  reducers: {
    AddTranscation: (state, action) => {
      state.history = [...state.history, action.payload];
    },
    UpdateTranscations: (state, action) => {
      state.history = action.payload;
    },
    ResetTranscations: (state) => {
      state.history = [];
    },
  },
});

export const { AddTranscation, UpdateTranscations, ResetTranscations } = History.actions;

export default History.reducer;
