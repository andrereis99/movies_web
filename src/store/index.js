/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerMiddleware } from 'connected-react-router';
import { persistStore } from 'redux-persist';
import history from '../utils/history';
import reducers from './reducers';

function configureStore(initialState = {}) {
	const middlewares = [routerMiddleware(history)];

	const enhancers = [applyMiddleware(...middlewares)];

	let composeEnhancers = compose;
    if (process.env.NODE_ENV !== 'production') composeEnhancers = composeWithDevTools({});
	const store = createStore(reducers, initialState, composeEnhancers(...enhancers));

	if (module.hot) {
		module.hot.accept('./reducers', () => {
            const nextRootReducer = require('./reducers');
            store.replaceReducer(nextRootReducer);
		});
	}

	return store;
}


export const store = configureStore();
export const persistor = persistStore(store);
