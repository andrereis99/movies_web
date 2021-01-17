import * as TYPES from '../constants';
import { connectRouter } from 'connected-react-router';
import history from '../../utils/history';

export const router = connectRouter(history);

export function language(state = '', action) {
	if (action.type === TYPES.SET_LANGUAGE) {
		return action.value;
	}

	return state;
}