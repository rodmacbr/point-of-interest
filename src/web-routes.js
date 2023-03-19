import { accountsController } from "./controllers/accounts-controller.js";
import { dashboardController } from "./controllers/dashboard-controller.js";
import { aboutController } from "./controllers/about-controller.js";
import { poiController } from "./controllers/poi-controller.js";
import { adminController } from "./controllers/admin-controller.js";
import { placeController } from "./controllers/place-controller.js";
import { reviewController } from "./controllers/review-controller.js";

export const webRoutes = [
	{ method: "GET", path: "/about", config: aboutController.index },
	{ method: "GET", path: "/", config: accountsController.index },
	{ method: "GET", path: "/signup", config: accountsController.showSignup },
	{ method: "GET", path: "/login", config: accountsController.showLogin },
	{ method: "GET", path: "/logout", config: accountsController.logout },
	{ method: "POST", path: "/register", config: accountsController.signup },
	{ method: "POST", path: "/authenticate", config: accountsController.login },

	{ method: "GET", path: "/dashboard", config: dashboardController.index },
	{ method: "POST", path: "/dashboard/addpoi", config: dashboardController.addPoi },

	{ method: "GET", path: "/poi/{id}", config: poiController.index },
	{ method: "POST", path: "/poi/{id}/addplace", config: poiController.addPlace },

	{ method: "GET", path: "/dashboard/deletepoi/{id}", config: dashboardController.deletePoi },
	{ method: "GET", path: "/dashboard/editpoi/{id}", config: dashboardController.getEditPoi },
	{ method: "POST", path: "/dashboard/editpoi/{id}", config: dashboardController.postEditPoi },
	{ method: "POST", path: "/poi/{id}/uploadimage/{placeid}", config: poiController.uploadImage },
	{ method: "GET", path: "/poi/{id}/deleteplace/{placeid}", config: poiController.deletePlace },
	{ method: "GET", path: "/poi/{id}/place/{placeid}", config: placeController.showPlaceView },
	{ method: "POST", path: "/poi/{id}/place/{placeid}", config: placeController.update },
	{ method: "POST", path: "/poi/{id}/addreview", config: reviewController.addReview },

	{ method: "GET", path: "/admin", config: adminController.index },
	{ method: "GET", path: "/admin/deleteuser/{id}", config: adminController.deleteUser },

	{ method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } }
];
