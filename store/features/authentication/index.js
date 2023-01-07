import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  password: '',
  auth: false,
};

const Authentication = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    AuthenticatedUser: (state, action) => {
      state.password = action.payload.password;
      state.auth = action.payload.auth;
    },
    ResetAuthentication: (state) => {
      state.password = '';
      state.auth = false;
    },
  },
});

export const { AuthenticatedUser, ResetAuthentication } = Authentication.actions;

export default Authentication.reducer;
