import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  password: '',
};

const Authentication = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    AuthenticatedUser: (state, action) => {
      state.password = action.payload;
    },
    ResetAuthentication: (state) => {
      state.password = '';
    },
  },
});

export const { AuthenticatedUser, ResetAuthentication } = Authentication.actions;

export default Authentication.reducer;
