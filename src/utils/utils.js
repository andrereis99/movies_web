import { toast as Toast } from 'react-toastify';
import Strings from './strings';

const TOAST_CLOSETIME = 5000;

class Popup {
	warning(message) {
		if (!message) throw new Error(Strings.errors.invalidArgs);

		if (Toast.isActive(`warning_${message}`)) {
			Toast.update(`warning_${message}`, { autoClose: TOAST_CLOSETIME })
		} else {
			Toast.warning(message, { toastId: `warning_${message}` });
		}
	}

	warn(message) {
		this.warning(message);
	}

	success(message) {
		if (!message) throw new Error(Strings.errors.invalidArgs);

		if (Toast.isActive(`success_${message}`)) {
			Toast.update(`success_${message}`, { autoClose: TOAST_CLOSETIME })
		} else {
			Toast.success(message, { toastId: `success_${message}` });
		}
	}

	error(message) {
		if (!message) throw new Error(Strings.errors.invalidArgs);

		if (Toast.isActive(`error_${message}`)) {
			Toast.update(`error_${message}`, { autoClose: TOAST_CLOSETIME })
		} else {
			Toast.error(message, { toastId: `error_${message}` });
		}
	}
}

export const toast = new Popup();