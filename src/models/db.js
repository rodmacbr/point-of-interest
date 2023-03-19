import { userMemStore } from "./mem/user-mem-store.js";
import { poiMemStore } from "./mem/poi-mem-store.js";
import { placeMemStore } from "./mem/place-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { poiJsonStore } from "./json/poi-json-store.js";
import { placeJsonStore } from "./json/place-json-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { poiMongoStore } from "./mongo/poi-mongo-store.js";
import { placeMongoStore } from "./mongo/place-mongo-store.js";
import { reviewMongoStore } from "./mongo/review-mongo-store.js";

export const db = {
  userStore: null,
  poiStore: null,
  placeStore: null,
  reviewStore: null,

  init(storeType) {
    switch (storeType) {
      case "json":
        this.userStore = userJsonStore;
        this.poiStore = poiJsonStore;
        this.placeStore = placeJsonStore;
        break;
      case "mongo":
        this.userStore = userMongoStore;
        this.poiStore = poiMongoStore;
        this.placeStore = placeMongoStore;
        this.reviewStore = reviewMongoStore;
        connectMongo();
        break;
      default:
        this.userStore = userMemStore;
        this.poiStore = poiMemStore;
        this.placeStore = placeMemStore;
    }
  }
};
