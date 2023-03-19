import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { assertSubset } from "../test-utils.js";

suite("Review Model tests", () => { // This is the test Model for Review that was added to Poi

	let dublinList = null;

	setup(async () => { // This is the setup for the reviews before testing them.
		db.init("mongo");
		await db.poiStore.deleteAllPois();
		// await db.reviewStore.deleteAllReviews();
		dublinList = await db.poiStore.addPoi(dublin);
		for (let i = 0; i < testReviews.length; i += 1) {
			// eslint-disable-next-line no-await-in-loop
			testReviews[i] = await db.reviewStore.addReview(dublinList._id, testReviews[i]);
		}
	});

	test("create single Review", async () => { // this is a test to add a review to poi. Adding Review1 in Fixtures.js to Cork Favourites Poi
		const corkList = await db.poiStore.addPoi(cork);
		const review = await db.reviewStore.addReview(corkList._id, review1);
		assert.isNotNull(review._id);
		assertSubset(review1, review);
	});

	test("get multiple reviews", async () => { // add multiple reviews to the Dublin Favourites Poi.
		const reviews = await db.reviewStore.getReviewsByPoiId(dublinList._id);
		assert.equal(testReviews.length, testReviews.length);
	});

	test("get a review - success", async () => {
		const corkList = await db.poiStore.addPoi(cork);
		const review = await db.reviewStore.addReview(corkList._id, review1);
		const newReview = await db.reviewStore.getReviewById(review._id);
		assertSubset(review1, newReview);
	});

	test("get a review - bad params", async () => {
		assert.isNull(await db.reviewStore.getReviewById());
	});
});