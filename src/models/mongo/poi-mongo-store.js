import { Poi } from "./poi.js";
import { placeMongoStore } from "./place-mongo-store.js";

export const poiMongoStore = {
  async getAllPois() {
    const pois = await Poi.find().lean();
    return pois;
  },

  async getPoiById(id) {
    if (id) {
      const poi = await Poi.findOne({ _id: id }).lean();
      if (poi) {
        poi.places = await placeMongoStore.getPlacesByPoiId(poi._id);
      }
      return poi;
    }
    return null;
  },

  async addPoi(poi) {
    const newPoi = new Poi(poi);
    const poiObj = await newPoi.save();
    return this.getPoiById(poiObj._id);
  },

  async updatePoi(poi) {
    const dbPoi = await this.getPoiById(poi._id);
    dbPoi.name = poi.name;
    const updatedPoi = await Poi.updateOne({ _id: poi._id }, dbPoi);
    return updatedPoi;
  },

  async getUserPois(id) {
    const poi = await Poi.find({ userid: id }).lean();
    return poi;
  },

  async deletePoiById(id) {
    try {
      await Poi.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllPois() {
    await Poi.deleteMany({});
  }
};
