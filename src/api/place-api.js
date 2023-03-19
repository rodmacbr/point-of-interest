import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import {
  IdSpec,
  PlaceSpec,
  PlaceSpecPlus,
  PlaceArraySpec,
  PlaceResponseSpec,
  PlaceResponseArraySpec
} from "../models/joi-schemas.js";
import { validationError } from "./logger.js";
import { imageStore } from "../models/image-store.js";

export const placeApi = {
  find: {
    auth: {
      strategy: "jwt",
      scope: "user"
    },
    handler: async function(request, h) {
      try {
        const places = await db.placeStore.getAllPlaces();
        // eslint-disable-next-line no-restricted-syntax
        for (const place of places) {
          // eslint-disable-next-line no-await-in-loop
        }
        return await Promise.all(places);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    response: { schema: PlaceResponseArraySpec, failAction: validationError },
    description: "Get all places",
    notes: "Returns all places"
  },

  findOne: {
    auth: {
      strategy: "jwt",
      scope: "user"
    },
    async handler(request) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No place with this id");
        }
          return place;
      } catch (err) {
        return Boom.serverUnavailable("No place with this id");
      }
    },
    tags: ["api"],
    description: "Find place",
    notes: "Returns one place",
    validate: { params: { id: IdSpec }, failAction: validationError },
    response: { schema: PlaceResponseSpec, failAction: validationError }
  },

  create: {
    auth: {
      strategy: "jwt",
      scope: "user"
    },
    handler: async function(request, h) {
      try {
        const place = await db.placeStore.addPlace(request.params.id, request.payload);
        if (place) {
          return h.response(place).code(201);
        }
        return Boom.badImplementation("error creating place");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Create a place",
    notes: "Returns newly created place",
    validate: { params: { id: IdSpec }, payload: PlaceSpec },
    response: { schema: PlaceSpecPlus, failAction: validationError }
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
      scope: "user"
    },
    handler: async function(request, h) {
      try {
        const places = db.placeStore.getAllPlaces();
        // eslint-disable-next-line no-restricted-syntax
        for (const place of places) {
          // eslint-disable-next-line no-restricted-syntax
          for (const image of place.img) {
            // eslint-disable-next-line no-await-in-loop
            await imageStore.deleteImage(image.public_id);
          }
        }
        await db.placeStore.deleteAllPlaces();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Delete all places"
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
      scope: "user"
    },
    handler: async function(request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No Place with this id");
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const image of place.img) {
          // eslint-disable-next-line no-await-in-loop
          await imageStore.deleteImage(image.public_id);
        }
        await db.placeStore.deletePlace(place._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Place with this id");
      }
    }
  },
  tags: ["api"],
  description: "Delete a place",
  validate: { params: { id: IdSpec }, failAction: validationError },

  addImage: {
    auth: {
      strategy: "jwt",
      scope: "user"
    },
    payload: {
      multipart: true,
      parse: true
    },
    handler: async function(request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No Place with this id");
        }
        // eslint-disable-next-line no-restricted-syntax
        for (const key of Object.keys(request.payload)) {
          const buffer = Buffer.from(request.payload[key]);
          // eslint-disable-next-line no-await-in-loop
          place.img.push(await imageStore.uploadImage(buffer));
        }
        await db.placeStore.updatePlace(place);
        return h.response().code(204);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable(err);
      }
    },
    tags: ["api"],
    description: "Add an image"
  },

  deleteImage: {
    auth: {
      strategy: "jwt",
      scope: "user"
    },
    handler: async function(request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No Place with this id");
        }
        const imageToDelete = place.img.find(image => image.public_id === request.params.imageid);
        place.img.splice(place.img.indexOf(imageToDelete), 1);
        await db.placeStore.updatePlace(place);
        await imageStore.deleteImage(imageToDelete.public_id);
        return h.response().code(204);
      } catch (err) {
        console.log(err);
        return Boom.serverUnavailable(err);
      }
    },
    tags: ["api"],
    description: "Delete an image from a place"
  }
};
