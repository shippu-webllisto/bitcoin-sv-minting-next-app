import { configureStore } from '@reduxjs/toolkit';
import { encryptTransform } from 'redux-persist-transform-encrypt';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { config } from '@/config/index';
import { rootReducer } from './features/rootReducer.js';

const encryptor = encryptTransform({
  secretKey: config.salt,
  onError: function (error) {
    return new Error(error);
  },
});

const persistConfig = {
  key: 'root',
  version: 1,
  storage: storage,
  whitelist: ['authentication', 'walletConnect', 'addAccount', 'tokens', 'nfts'],
  blacklist: [],
  timeout: null,
  transforms: [encryptor],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
