import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials, bars, testPois } from "../fixtures.js";

suite("Poi API tests", () => {
	let user = null;

	setup(async () => {
		placemarkService.clearAuth();
		user = await placemarkService.createUser(maggie);
		await placemarkService.authenticate(maggieCredentials);
		await placemarkService.deleteAllPois();
		await placemarkService.deleteAllUsers();
		user = await placemarkService.createUser(maggie);
		await placemarkService.authenticate(maggieCredentials);
		bars.userid = user._id;
	});

	teardown(async () => {
	});

	test("create poi", async () => {
		const returnedPoi = await placemarkService.createPoi(bars);
		assert.isNotNull(returnedPoi);
		assertSubset(bars, returnedPoi);
	});

	test("delete a poi", async () => {
		const poi = await placemarkService.createPoi(bars);
		const response = await placemarkService.deletePoi(poi._id);
		assert.equal(response.status, 204);
		try {
			const returnedPoi = await placemarkService.getPoi(poi.id);
			assert.fail("Should not return a response");
		} catch (error) {
			assert(error.response.data.message === "No Poi with this id", "Incorrect Response Message");
		}
	});

	test("create multiple pois", async () => {
		for (let i = 0; i < testPois.length; i += 1) {
			testPois[i].userid = user._id;
			// eslint-disable-next-line no-await-in-loop
			await placemarkService.createPoi(testPois[i]);
		}
		let returnedLists = await placemarkService.getAllPois();
		assert.equal(returnedLists.length, testPois.length);
		await placemarkService.deleteAllPois();
		returnedLists = await placemarkService.getAllPois();
		assert.equal(returnedLists.length, 0);
	});

	test("remove non-existant poi", async () => {
		try {
			const response = await placemarkService.deletePoi("not an id");
			assert.fail("Should not return a response");
		} catch (error) {
			assert(error.response.data.message === "No Poi with this id", "Incorrect Response Message");
		}
	});
});
