import { v4 } from "uuid";
import { placeMemStore } from "./place-mem-store.js";

let pois = [];

export const poiMemStore = {
	async getAllPois() {
		return pois;
	},

	async addPoi(poi) {
		poi._id = v4();
		pois.push(poi);
		return poi;
	},

	async getPoiById(id) {
		const cat = pois.find((poi) => poi._id === id);
		if (cat) {
			cat.places = await placeMemStore.getPlacesByPoiId(cat._id);
			return cat;
		}
		return null;
	},

	async getUserPois(userid) {
		return pois.filter((poi) => poi.userid === userid);
	},

	async deletePoiById(id) {
		const index = pois.findIndex((poi) => poi._id === id);
		if (index !== -1) pois.splice(index, 1);
	},

	async deleteAllPois() {
		pois = [];
	}
};
