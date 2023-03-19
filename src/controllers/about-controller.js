export const aboutController = {
	index: {
		handler: function(request, h) {
			const viewData = {
				title: "About PlaceMark"
			};
			return h.view("about-view", viewData);
		}
	}
};
