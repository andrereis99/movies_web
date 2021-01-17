/* eslint-disable no-restricted-globals */
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import EndpointsList from './endpoints';
import { store } from '../store';
import { push } from 'connected-react-router';
import Strings from './strings';

const isBetween = (v, a, b) => v >= a && v <= b;

export default class ApiSauce {
    static Endpoints = EndpointsList;

    constructor(config = {}) {
        const { headers, ...axiosConfig } = config || {};

        this.headers = headers
        this.instance = axios.create(axiosConfig)
        this.stack = [];
    }

    defaultHeaders = () => {
        const { token } = store.getState();
        const lang = Strings.getLanguage();
		const headers = {
			'Accept-Language': lang,
		};

		if (token) headers.Authorization = `Bearer ${token}`;

		return headers;
	};

    addToStack = (url) => {
		this.stack.push(url);
	};

	removeFromStack = (url) => {
		const index = this.stack.indexOf(url);
		if (index !== -1) this.stack.splice(index, 1);
		return index !== -1;
	};

	requestWithBody = ({ method = '', url = '', data = null, params = {}, axiosConfig = {}, ...args }) => {
		return this.request(Object.assign({ url, method, data, params }, args, axiosConfig));
	};

    /**
	 * Generic request for any method
	 * @param {*} axiosConfig
	 */
	request = (axiosConfig) => {
		const { ...config } = axiosConfig;

		config.headers = {
			...this.headers,
			...this.defaultHeaders(),
			...config.headers,
        };

		console.log('#DEBUG-API', config.method, config.url);

		// console.log('stack : ', this.stack);

		// if (this.stack.find((r) => r === config.url)) {
		// 	// Already processing this uri, ignores duplicated
		// 	console.log('DUPLICATE_REQUEST');
		// 	return;
		// }

		this.addToStack(config.url); // Add to requests stack

		// const startDate = new Date().valueOf();
		// const chain = this.chain(startDate, axiosConfig, config.headers);

		return this.instance.request(config); //.then(chain).catch(chain);
	};

    chain = (startDate, axiosConfig, headers) => {
		const { handleError = false, ...config } = axiosConfig;
		return async (axiosResult) => {
			const response = await this.convertResponse(startDate, axiosResult);
			response.sentHeaders = headers;

			this.removeFromStack(config.url); // Remove from stack
			if (response.originalError && !handleError) {
				// management of error
				this.handleError(response);
			}

			/*
			 * Sentry.addBreadcrumb({
			 * 	category: 'API Call',
			 * 	data: response,
			 * 	message: config.url,
			 * 	level: Sentry.Severity.Info,
			 * });
			 */

			// Custom Error Handling
			if (response.data && response.data.error) {
				// something here
			}
			return response;
		};
    };
    
    convertResponse = async (startedAt, axiosResult) => {
		// console.log('----- axiosResult ------');
		// console.log(JSON.stringify(axiosResult));

		const end = new Date().valueOf();
		const duration = end - startedAt;
		const isError = axiosResult instanceof Error || axios.isCancel(axiosResult);
		const axiosResponse = axiosResult;
		const axiosError = axiosResult;
		const response = isError ? axiosError.response : axiosResponse;
		const status = (response && response.status) || 0;
		const originalError = isError ? axiosError : null;
		const ok = isBetween(status, 200, 299);
		const config = axiosResult.config || null;
		const headers = (response && response.headers) || null;
		const data = (response && response.data) || null;

		const transformedResponse = {
			duration,
			originalError,
			ok,
			headers,
			config,
			data,
			status,
			sentHeaders: null,
		};

		if (ok && data && data.error) {
			transformedResponse.ok = false;
		}

		// apisauce by infinitered has more code in this step

		return transformedResponse;
	};

	get = (args = {}) => {
		return this.request({ method: 'get', ...args });
	};

	post = (args = {}) => {
		return this.requestWithBody({ method: 'post', ...args });
	};
}

export const Endpoints = EndpointsList;

export const API = new ApiSauce();

export const GET = API.get;
export const POST = API.post;