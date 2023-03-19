import axios from "axios";

import { serviceUrl } from "../fixtures.js";

export const placemarkService = {
	placemarkUrl: serviceUrl,

	async authenticate(user) {
		const response = await axios.post(`${this.placemarkUrl}/api/users/authenticate`, user);
		axios.defaults.headers.common.Authorization = `Bearer ${response.data.token}`;
		return response.data;
	},

	async clearAuth() {
		axios.defaults.headers.common.Authorization = "";
	},

	async createUser(user) {
		const res = await axios.post(`${this.placemarkUrl}/api/users`, user);
		return res.data;
	},

	async getUser(id) {
		const res = await axios.get(`${this.placemarkUrl}/api/users/${id}`);
		return res.data;
	},

	async getAllUsers() {
		const res = await axios.get(`${this.placemarkUrl}/api/users`);
		return res.data;
	},

	async deleteAllUsers() {
		const res = await axios.delete(`${this.placemarkUrl}/api/users`);
		return res.data;
	},
	async createPoi(poi) {
		const res = await axios.post(`${this.placemarkUrl}/api/pois`, poi);
		return res.data;
	},

	async deleteAllPois() {
		const response = await axios.delete(`${this.placemarkUrl}/api/pois`);
		return response.data;
	},

	async deletePoi(id) {
		const response = await axios.delete(`${this.placemarkUrl}/api/pois/${id}`);
		return response;
	},

	async getAllPois() {
		const res = await axios.get(`${this.placemarkUrl}/api/pois`);
		return res.data;
	},

	async getPoi(id) {
		const res = await axios.get(`${this.placemarkUrl}/api/pois/${id}`);
		return res.data;
	},

	async getAllPlaces() {
		const res = await axios.get(`${this.placemarkUrl}/api/places`);
		return res.data;
	},

	async createPlace(id, place) {
		const res = await axios.post(`${this.placemarkUrl}/api/pois/${id}/places`, place);
		return res.data;
	},

	async deleteAllPlaces() {
		const res = await axios.delete(`${this.placemarkUrl}/api/places`);
		return res.data;
	},

	async getPlace(id) {
		const res = await axios.get(`${this.placemarkUrl}/api/places/${id}`);
		return res.data;
	},

	async deletePlace(id) {
		const res = await axios.delete(`${this.placemarkUrl}/api/places/${id}`);
		return res.data;
	}
};
