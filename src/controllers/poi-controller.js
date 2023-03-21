import { db } from "../models/db.js";
import { PlaceFormInputSpec, PlaceSpec } from "../models/joi-schemas.js";
import { imageStore } from "../models/image-store.js";

export const poiController = {
	index: {
		handler: async function(request, h) {
			const loggedInUser = request.auth.credentials;
			const poi = await db.poiStore.getPoiById(request.params.id);
			const reviews = await db.reviewStore.getReviewsByPoiId(request.params.id);
			const viewData = {
				title: poi.name,
				poi: poi,
				user: loggedInUser,
				reviews: reviews
			};
			return h.view("poi-view", viewData);
		}
	},

	addPlace: {
		validate: {
			payload: PlaceSpec,
			options: { abortEarly: false },
			failAction: async function(request, h, error) {
				const loggedInUser = request.auth.credentials;
				const currentPoi = await db.poiStore.getPoiById(request.params.id);
				return h.view("poi-view", {
					title: "Add place error",
					poi: currentPoi,
					user: loggedInUser,
					errors: error.details
				}).takeover().code(400);
			}
		},
		handler: async function(request, h) {
			const poi = await db.poiStore.getPoiById(request.params.id);
			const newPlace = {
				name: request.payload.name,
				description: request.payload.description,
				latitude: Number(request.payload.latitude),
				longitude: Number(request.payload.longitude),
				category: request.payload.category,
			};
			await db.placeStore.addPlace(poi._id, newPlace);
			return h.redirect(`/poi/${poi._id}`);
		}
	},

	uploadImage: {
		handler: async function(request, h) {
			try {
				const poi = await db.poiStore.getPoiById(request.params.id);
				const place = await db.placeStore.getPlaceById(request.params.placeid);
				const file = request.payload.imagefile;
				if (Object.keys(file).length > 0) {
					const url = await imageStore.uploadImage(request.payload.imagefile);
					place.img = url;
					await db.placeStore.updatePlace(place);
				}
				return h.redirect(`/poi/${poi._id}`);
			} catch (err) {
				console.log(err);
				return h.redirect(`/poi/${poi._id}`);
			}
		},
		payload: {
			multipart: true,
			output: "data",
			maxBytes: 209715200,
			parse: true
		}
	},

	deletePlace: {
		handler: async function(request, h) {
			const poi = await db.poiStore.getPoiById(request.params.id);
			await db.placeStore.deletePlace(request.params.placeid);
			return h.redirect(`/poi/${poi._id}`);
		}
	}
};
