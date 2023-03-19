import Boom from "@hapi/boom";
import bcrypt from "bcrypt";
import { createToken } from "./jwt-utils.js";
import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec, UserSpecPlus, IdSpec, UserArray, JwtAuth } from "../models/joi-schemas.js";
import { validationError } from "./logger.js";

const saltRounds = 10;

export const userApi = {
	authenticate: {
		auth: false,
		handler: async function(request, h) {
			try {
				const user = await db.userStore.getUserByEmail(request.payload.email);
				if (!user) {
					return Boom.unauthorized("User not found");
				}
				const passwordsMatch = await bcrypt.compare(request.payload.password, user.password);
				if (!passwordsMatch) {
					return Boom.unauthorized("Invalid password");
				}
				const token = createToken(user);
				return h.response({ success: true, token: token }).code(201);
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		},
		tags: ["api"],
		description: "Authenticate a user",
		notes: "If user has valid creds, create and return a JWT token",
		validate: { payload: UserCredentialsSpec, failAction: validationError },
		response: { schema: JwtAuth, failAction: validationError }
	},

	find: {
		auth: {
			strategy: "jwt",
			scope: "admin"
		},
		handler: async function(request, h) {
			try {
				const users = await db.userStore.getAllUsers();
				return users;
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		},
		tags: ["api"],
		description: "Get all users",
		notes: "Returns details of all users",
		response: { schema: UserArray, failAction: validationError }
	},

	findOne: {
		auth: {
			strategy: "jwt",
			scope: "admin"
		},
		handler: async function(request, h) {
			try {
				const user = await db.userStore.getUserById(request.params.id);
				if (!user) {
					return Boom.notFound("No User with this id");
				}
				return user;
			} catch (err) {
				return Boom.serverUnavailable("No User with this id");
			}
		},
		tags: ["api"],
		description: "Get a specific user",
		notes: "Returns user details",
		validate: { params: { id: IdSpec }, failAction: validationError },
		response: { schema: UserSpecPlus, failAction: validationError }
	},

	create: {
		auth: false,
		handler: async function(request, h) {
			try {
				const user = request.payload;
				user.password = await bcrypt.hash(user.password, saltRounds);
				const addedUser = await db.userStore.addUser(user);
				if (addedUser) {
					return h.response(user).code(201);
				}
				return Boom.badImplementation("error creating user");
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		},
		tags: ["api"],
		description: "Create a User",
		notes: "Returns the newly created user",
		validate: { payload: UserSpec, failAction: validationError },
		response: { schema: UserSpecPlus, failAction: validationError }
	},

	deleteAll: {
		auth: {
			strategy: "jwt",
			scope: "admin"
		},
		handler: async function(request, h) {
			try {
				await db.userStore.deleteAll();
				return h.response().code(204);
			} catch (err) {
				return Boom.serverUnavailable("Database Error");
			}
		},
		tags: ["api"],
		description: "Delete all users",
		notes: "Delete all users"
	}
};
