import { db } from "../models/db.js";

export async function analytics() {
  const users = await db.userStore.getAllUsers();
  const pois = await db.poiStore.getAllPois();
  const places = await db.placeStore.getAllPlaces();
  return {
    userCount: users.length,
    poiCount: pois.length,
    placeCount: places.length
  };
}
