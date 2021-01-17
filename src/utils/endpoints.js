/* eslint-disable import/no-anonymous-default-export */
const API_URL = 'http://localhost:3001/api/';

export default {
	uriMovies(id = '') {
		return `${API_URL}movies/${id}`;
    },

    uriPeople(id = '') {
		return `${API_URL}people/${id}`;
	},
};
