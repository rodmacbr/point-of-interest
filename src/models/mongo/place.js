import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placeSchema = new Schema({
	name: String,
	description: String,
	latitude: Number,
	longitude: Number,
	category: String,
	poiid: {
		type: Schema.Types.ObjectId,
		ref: "Poi"
	},
});

export const Place = Mongoose.model("Place", placeSchema);
