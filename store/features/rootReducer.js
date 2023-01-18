import { combineReducers } from '@reduxjs/toolkit';
import authenticationReducer from './authentication/index.js';
import walletConnectReducer from './wallet-connect/index.jsx';
import addAccountReducer from './add-account/index.js';
import tokenReducer from './tokens/index.js';
import nftReducer from './nfts/index';
import historyReducer from './history/index.js';

export const rootReducer = combineReducers({
  authentication: authenticationReducer,
  walletConnect: walletConnectReducer,
  addAccount: addAccountReducer,
  tokens: tokenReducer,
  nfts: nftReducer,
  history: historyReducer,
});
