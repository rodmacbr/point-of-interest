import { db } from "../models/db.js";
import { PoiSpec } from "../models/joi-schemas.js";

export const dashboardController = {
  index: {
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;
      const pois = await db.poiStore.getUserPois(loggedInUser._id);
      const viewData = {
        title: "PlaceMark Dashboard",
        user: loggedInUser,
        pois: pois
      };
      return h.view("dashboard-view", viewData);
    }
  },

  addPoi: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: async function(request, h, error) {
        const loggedInUser = request.auth.credentials;
        const pois = await db.poiStore.getUserPois(loggedInUser._id);
        return h.view("dashboard-view", {
          title: "Add Poi error",
          pois: pois,
          user: loggedInUser,
          errors: error.details
        }).takeover().code(400);
      }
    },
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;
      const newPoi = {
        userid: loggedInUser._id,
        name: request.payload.name
      };
      await db.poiStore.addPoi(newPoi);
      return h.redirect("/dashboard");
    }
  },

  getEditPoi: {
    handler: async function(request, h) {
      const poi = await db.poiStore.getPoiById(request.params.id);
      console.log(poi);
      return h.view("partials/edit-poi", poi);
    }
  },

  postEditPoi: {
    validate: {
      payload: PoiSpec,
      options: { abortEarly: false },
      failAction: async function(request, h, error) {
        const loggedInUser = request.auth.credentials;
        const pois = await db.poiStore.getUserPois(loggedInUser._id);
        return h.view("dashboard-view", {
          title: "Add Poi error",
          pois: pois,
          user: loggedInUser,
          errors: error.details
        }).takeover().code(400);
      }
    },
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;
      const updatedPoi = {
        _id: request.params.id,
        userid: loggedInUser._id,
        name: request.payload.name
      };
      await db.poiStore.updatePoi(updatedPoi);
      return h.redirect("/dashboard");
    }
  },

  deletePoi: {
    handler: async function(request, h) {
      const poi = await db.poiStore.getPoiById(request.params.id);
      await db.poiStore.deletePoiById(poi._id);
      return h.redirect("/dashboard");
    }
  }
};
