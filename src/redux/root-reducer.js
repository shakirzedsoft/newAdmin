import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
// slices
import checkoutReducer from './slices/checkout';
import villaslice from './slices/villaslice';
// ----------------------------------------------------------------------

const checkoutPersistConfig = {
  key: 'checkout',
  storage,
  keyPrefix: 'redux-',
};

export const rootReducer = combineReducers({
  checkout: persistReducer(checkoutPersistConfig, checkoutReducer),

  //villa project slice
  villa:villaslice,
});
