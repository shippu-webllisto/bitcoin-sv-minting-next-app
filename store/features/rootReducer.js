import { combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from './authentication/index.js';
import walletConnectReducer from './wallet-connect/index.jsx';
import addAccountReducer from './add-account/index.js';

export const rootReducer = combineReducers({
  authentication: authenticationReducer,
  walletConnect: walletConnectReducer,
  addAccount: addAccountReducer,
});
