import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials, kilkenny, testPlaces, cleeres, notaplace } from "../fixtures.js";

suite("Place API tests", () => {
	let user = null;
	let kilkennyPlaces = null;

	setup(async () => {
		placemarkService.clearAuth();
		user = await placemarkService.createUser(maggie);
		await placemarkService.authenticate(maggieCredentials);
		await placemarkService.deleteAllPois();
		await placemarkService.deleteAllPlaces();
		await placemarkService.deleteAllUsers();
		user = await placemarkService.createUser(maggie);
		await placemarkService.authenticate(maggieCredentials);
		kilkenny.userid = user._id;
		kilkennyPlaces = await placemarkService.createPoi(kilkenny);
	});

	teardown(async () => {
	});

	test("create place", async () => {
		const returnedPlace = await placemarkService.createPlace(kilkennyPlaces._id, cleeres);
		assertSubset(cleeres, returnedPlace);
	});

	test("create a place with invalid coordinates - fail", async () => {
		try {
			const returnedplace = await placemarkService.createPlace(kilkennyPlaces._id, notaplace);
			assert.fail("Should not return a response");
		} catch (error) {
			assert.equal(error.response.data.statusCode, 400);
		}
	});

	test("create Multiple places", async () => {
		for (let i = 0; i < testPlaces.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await placemarkService.createPlace(kilkennyPlaces._id, testPlaces[i]);
		}
		const returnedPlaces = await placemarkService.getAllPlaces();
		assert.equal(returnedPlaces.length, testPlaces.length);
		for (let i = 0; i < returnedPlaces.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const place = await placemarkService.getPlace(returnedPlaces[i]._id);
			assertSubset(place, returnedPlaces[i]);
		}
	});

	test("Delete PlaceApi", async () => {
		for (let i = 0; i < testPlaces.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await placemarkService.createPlace(kilkennyPlaces._id, testPlaces[i]);
		}
		let returnedPlaces = await placemarkService.getAllPlaces();
		assert.equal(returnedPlaces.length, testPlaces.length);
		for (let i = 0; i < returnedPlaces.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			const place = await placemarkService.deletePlace(returnedPlaces[i]._id);
		}
		returnedPlaces = await placemarkService.getAllPlaces();
		assert.equal(returnedPlaces.length, 0);
	});

	test("denormalised poi", async () => {
		for (let i = 0; i < testPlaces.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			await placemarkService.createPlace(kilkennyPlaces._id, testPlaces[i]);
		}
		const returnedPoi = await placemarkService.getPoi(kilkennyPlaces._id);
		assert.equal(returnedPoi.places.length, testPlaces.length);
		for (let i = 0; i < testPlaces.length; i += 1) {
			assertSubset(testPlaces[i], returnedPoi.places[i]);
		}
	});
});
