import Hapi from "@hapi/hapi";
import HapiSwagger from "hapi-swagger";
import Vision from "@hapi/vision";
import Handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";
import Cookie from "@hapi/cookie";
import dotenv from "dotenv";
import Joi from "joi";
import Inert from "@hapi/inert";
import jwt from "hapi-auth-jwt2";
import { validate } from "./api/jwt-utils.js";
import { webRoutes } from "./web-routes.js";
import { apiRoutes } from "./api-routes.js";
import { db } from "./models/db.js";
import helpers from "./views/helpers/helpers.js";
import { accountsController } from "./controllers/accounts-controller.js";

const swaggerOptions = {
	info: {
		title: "Placemark API",
		version: "1.0"
	},
	securityDefinitions: {
		jwt: {
			type: "apiKey",
			name: "Authorization",
			in: "header"
		}
	},
	security: [{ jwt: [] }]
};


const result = dotenv.config();
if (result.error) {
	console.log(result.error.message);
	// process.exit(1);
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function init() {
	const server = Hapi.server({
		port: process.env.PORT || 3000,
		routes: { cors: true }
	});
	await server.register([
		Inert,
		Vision,
		Cookie,
		jwt,
		{
			plugin: HapiSwagger,
			options: swaggerOptions
		}
	]);
	server.views({
		engines: {
			hbs: Handlebars
		},
		relativeTo: __dirname,
		path: "./views",
		layoutPath: "./views/layouts",
		partialsPath: "./views/partials",
		helpersPath: "./views/helpers",
		layout: true,
		isCached: false
	});
	server.validator(Joi);
	server.auth.strategy("session", "cookie", {
		cookie: {
			name: process.env.cookie_name,
			password: process.env.cookie_password,
			isSecure: false
		},
		redirectTo: "/",
		validateFunc: accountsController.validate
	});
	server.auth.strategy("jwt", "jwt", {
		key: process.env.cookie_password,
		validate: validate,
		verifyOptions: { algorithms: ["HS256"] }
	});
	server.auth.default("session");
	db.init("mongo");
	server.route(webRoutes);
	server.route(apiRoutes);
	helpers(Handlebars);
	await server.start();
	console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
	console.log(err);
	process.exit(1);
});

init();
