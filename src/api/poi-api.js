import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PoiArraySpec, PoiSpec, PoiSpecPlus } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { Poi } from "../models/mongo/poi.js";

export const poiApi = {
	find: {
		auth: {
			strategy: "jwt",
			scope: "user"
		},
		handler: async function(request, h) {
			try {
				const pois = await db.poiStore.getAllPois();
				return pois;
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		},
		tags: ["api"],
		response: { schema: PoiArraySpec, failAction: validationError },
		description: "Get all pois",
		notes: "Returns all pois"
	},

	findOne: {
		auth: {
			strategy: "jwt",
			scope: "user"
		},
		async handler(request) {
			try {
				const poi = await db.poiStore.getPoiById(request.params.id);
				if (!poi) {
					return Boom.notFound("No Poi with this id");
				}
				return poi;
			} catch (err) {
				return Boom.serverUnavailable("No Poi with this id");
			}
		},
		tags: ["api"],
		description: "Find a poi",
		notes: "Returns a poi",
		validate: { params: { id: IdSpec }, failAction: validationError },
		response: { schema: PoiSpecPlus, failAction: validationError }
	},

	create: {
		auth: {
			strategy: "jwt",
			scope: "user"
		},
		handler: async function(request, h) {
			try {
				const poi = request.payload;
				const newPoi = await db.poiStore.addPoi(poi);
				if (newPoi) {
					return h.response(newPoi).code(201);
				}
				return Boom.badImplementation("error creating poi");
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		},
		tags: ["api"],
		description: "Create a poi",
		notes: "Returns the newly created poi",
		validate: { payload: PoiSpec, failAction: validationError },
		response: { schema: PoiSpecPlus, failAction: validationError }
	},

	deleteOne: {
		auth: {
			strategy: "jwt",
			scope: "user"
		},
		handler: async function(request, h) {
			try {
				const poi = await db.poiStore.getPoiById(request.params.id);
				if (!poi) {
					return Boom.notFound("No Poi with this id");
				}
				await db.poiStore.deletePoiById(poi._id);
				return h.response().code(204);
			} catch (err) {
				return Boom.serverUnavailable("No Poi with this id");
			}
		},
		tags: ["api"],
		description: "Delete a poi",
		validate: { params: { id: IdSpec }, failAction: validationError }
	},

	deleteAll: {
		auth: {
			strategy: "jwt",
			scope: "user"
		},
		handler: async function(request, h) {
			try {
				await db.poiStore.deleteAllPois();
				return h.response().code(204);
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		}
	},
	tags: ["api"],
	description: "Delete all pois"
};
