import { userApi } from "./api/user-api.js";
import { poiApi } from "./api/poi-api.js";
import { placeApi } from "./api/place-api.js";

export const apiRoutes = [
	{ method: "GET", path: "/api/users", config: userApi.find },
	{ method: "POST", path: "/api/users", config: userApi.create },
	{ method: "DELETE", path: "/api/users", config: userApi.deleteAll },
	{ method: "GET", path: "/api/users/{id}", config: userApi.findOne },

	{ method: "POST", path: "/api/users/authenticate", config: userApi.authenticate },

	{ method: "POST", path: "/api/pois", config: poiApi.create },
	{ method: "DELETE", path: "/api/pois", config: poiApi.deleteAll },
	{ method: "GET", path: "/api/pois", config: poiApi.find },
	{ method: "GET", path: "/api/pois/{id}", config: poiApi.findOne },
	{ method: "DELETE", path: "/api/pois/{id}", config: poiApi.deleteOne },

	{ method: "GET", path: "/api/places", config: placeApi.find },
	{ method: "GET", path: "/api/places/{id}", config: placeApi.findOne },
	{ method: "POST", path: "/api/pois/{id}/places", config: placeApi.create },
	{ method: "DELETE", path: "/api/places", config: placeApi.deleteAll },
	{ method: "DELETE", path: "/api/places/{id}", config: placeApi.deleteOne },
	{ method: "POST", path: "/api/places/{id}/images", config: placeApi.addImage },
	{ method: "DELETE", path: "/api/places/{id}/images/{imageid}", config: placeApi.deleteImage }
];
