import { combineReducers } from '@reduxjs/toolkit';
import walletConnectReducer from './wallet-connect/index.jsx';
import addAccountReducer from './add-account/index.js';

export const rootReducer = combineReducers({
  walletConnect: walletConnectReducer,
  addAccount: addAccountReducer,
});
