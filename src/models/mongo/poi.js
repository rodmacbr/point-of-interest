import Mongoose from "mongoose";

const { Schema } = Mongoose;

const poiSchema = new Schema({
	name: String,
	userid: {
		type: Schema.Types.ObjectId,
		ref: "User"
	}
});

export const Poi = Mongoose.model("Poi", poiSchema);
