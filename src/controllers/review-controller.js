import { db } from "../models/db.js";

export const reviewController = {
	addReview: {
		handler: async function(request, h) {
			const user = await db.userStore.getUserById(request.auth.credentials.id);
			const newReview = {
				rating: request.payload.rating,
				comment: request.payload.comment,
				userid: user.id,
				poiid: request.params.id
			};

			const review = await db.reviewStore.addReview(newReview);
			return h.redirect(`/poi/${request.params.id}`);
		}
	}
};