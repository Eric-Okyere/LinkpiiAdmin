import { legacy_createStore as createStore} from "redux";
import reducers from "./reducers";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';



const persistConfig = {
    key: 'root',
    storage,
  }

const persistedReducer = persistReducer(persistConfig, reducers)

let store = createStore(persistedReducer)
export const persistor = persistStore(store)

export default store;