/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { connectRouter } from 'connected-react-router';
import { persistCombineReducers } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import * as Reducers from './mix';

import history from '../../utils/history';

const config = {
    key: window.location.hostname,
    storage,
    blacklist: ['loader', 'title', 'language'],
};

// @ts-ignore
const persistReducers = persistCombineReducers(config, Reducers);

const rootReducer = (state, action) => persistReducers(state, action);
// @ts-ignore
export default connectRouter(history)(rootReducer);
