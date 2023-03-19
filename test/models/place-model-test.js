import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testPois, testPlaces, kilkenny, bars, cleeres } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Place Model tests", () => {
	let kilkennyPlaces = null;

	setup(async () => {
		db.init("mongo");
		await db.poiStore.deleteAllPois();
		await db.placeStore.deleteAllPlaces();
		kilkennyPlaces = await db.poiStore.addPoi(kilkenny);
		for (let i = 0; i < testPlaces.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			testPlaces[i] = await db.placeStore.addPlace(kilkennyPlaces._id, testPlaces[i]);
		}
	});

	test("create single place", async () => {
		const barsList = await db.poiStore.addPoi(bars);
		const place = await db.placeStore.addPlace(barsList._id, cleeres);
		assert.isNotNull(place._id);
		assertSubset(cleeres, place);
	});

	test("get multiple places", async () => {
		const places = await db.placeStore.getPlacesByPoiId(kilkennyPlaces._id);
		assert.equal(testPlaces.length, testPlaces.length);
	});

	test("delete all places", async () => {
		const places = await db.placeStore.getAllPlaces();
		assert.equal(testPlaces.length, places.length);
		await db.placeStore.deleteAllPlaces();
		const newPlaces = await db.placeStore.getAllPlaces();
		assert.equal(0, newPlaces.length);
	});

	test("get a place - success", async () => {
		const barsList = await db.poiStore.addPoi(bars);
		const place = await db.placeStore.addPlace(barsList._id, cleeres);
		const newPlace = await db.placeStore.getPlaceById(place._id);
		assertSubset(cleeres, newPlace);
	});

	test("delete One Place - success", async () => {
		await db.placeStore.deletePlace(testPlaces[0]._id);
		const places = await db.placeStore.getAllPlaces();
		assert.equal(places.length, testPois.length - 1);
		const deletedPlace = await db.placeStore.getPlaceById(testPlaces[0]._id);
		assert.isNull(deletedPlace);
	});

	test("update one place with image", async () => {
		const imageUrl = "images/testimage.jpg";
		const barsList = await db.poiStore.addPoi(bars);
		const place = await db.placeStore.addPlace(barsList._id, cleeres);
		place.img = imageUrl;
		const updatedPlace = await db.placeStore.updatePlace(place);
		assert.equal(updatedPlace.img, imageUrl);
	});

	test("get a place - bad params", async () => {
		assert.isNull(await db.placeStore.getPlaceById(""));
		assert.isNull(await db.placeStore.getPlaceById());
	});

	test("delete one place - fail", async () => {
		await db.placeStore.deletePlace("bad-id");
		const places = await db.placeStore.getAllPlaces();
		assert.equal(places.length, testPois.length);
	});
});
