import { Place } from "./place.js";

export const placeMongoStore = {
	async getAllPlaces() {
		const places = await Place.find().lean();
		return places;
	},

	async addPlace(poiId, place) {
		place.poiid = poiId;
		const newPlace = new Place(place);
		const placeObj = await newPlace.save();
		return this.getPlaceById(placeObj._id);
	},

	async getPlacesByPoiId(id) {
		const places = await Place.find({ poiid: id }).lean();
		return places;
	},

	async getPlaceById(id) {
		if (id) {
			const place = await Place.findOne({ _id: id }).lean();
			return place;
		}
		return null;
	},

	async deletePlace(id) {
		try {
			await Place.deleteOne({ _id: id });
		} catch (error) {
			console.log("bad id");
		}
	},

	async deleteAllPlaces() {
		await Place.deleteMany({});
	},

	async updatePlace(placeid, updatedPlace) {
		const place = await Place.findOne({ _id: placeid });
		place.name = updatedPlace.name;
		place.description = updatedPlace.description;
		place.img = updatedPlace.img;
		place.latitude = updatedPlace.latitude;
		place.longitude = updatedPlace.longitude;
		place.category = updatedPlace.category;
		await place.save();
		return place.findOne({ _id: placeid });
	}
};
