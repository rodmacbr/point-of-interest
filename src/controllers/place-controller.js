import { PlaceSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const placeController = {
	index: {
		handler: async function(request, h) {
			const poi = await db.poiStore.getPoiById(request.params.id);
			const place = await db.placeStore.getPlaceById(request.params.placeid);
			const viewData = {
				title: "Edit place",
				poi: poi,
				place: place
			};
			return h.view("update-place-view", viewData);
		}
	},


	update: {
		validate: {
			payload: PlaceSpec,
			options: { abortEarly: false },
			failAction: function(request, h, error) {
				return h.view("update-place-view", { title: "Edit place error", errors: error.details }).takeover().code(400);
			}
		},
		handler: async function(request, h) {
			const place = await db.placeStore.getPlaceById(request.params.placeid);
			const newPlace = {
				name: request.payload.name,
				description: request.payload.description,
				latitude: Number(request.payload.latitude),
				longitude: Number(request.payload.longitude),
				category: request.payload.category
			};
			try {
				await db.placeStore.updatePlace(request.params.placeid, newPlace);
			} catch (error) {
				console.log(error);
			}
			return h.redirect(`/poi/${request.params.id}`);
		}
	},

	showPlaceView: {
		handler: async function(request, h) {
			const place = await db.placeStore.getPlaceById(request.params.placeid);
			const viewData = {
				title: "Update place",
				place: place
			};
			return h.view("update-place-view", viewData);
		}
	}
};
