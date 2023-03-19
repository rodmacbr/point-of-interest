import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
	.keys({
		email: Joi.string().email().example("homer@simpson.com").required(),
		password: Joi.string().example("secret").required()
	})
	.label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
	firstName: Joi.string().example("Homer").required(),
	lastName: Joi.string().example("Simpson").required(),
	scope: Joi.array().items(Joi.string()).example(["user"])
}).label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
	_id: IdSpec,
	__v: Joi.number()
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const PlaceFormInputSpec = {
	name: Joi.string().required(),
	description: Joi.string().required(),
	latitude: Joi.number().min(-90).max(90).required(),
	longitude: Joi.number().min(-180).max(180).required(),
	category: Joi.string().required()
};

export const PlaceSpec = Joi.object()
	.keys({
		name: Joi.string().required().example("Dublin Castle"),
		description: Joi.string().required().example("13th century Norman castle"),
		img: Joi.array().items(Joi.object()).required().example("[]"),
		location: Joi.object().keys({
			latitude: Joi.number().min(-90).max(90).required(),
			longitude: Joi.number().min(-180).max(180).required(),
		category: Joi.string().example("Others").required()
		}),
		poiid: IdSpec
	})
	.label("Place");

export const PlaceSpecPlus = PlaceSpec.keys({
	_id: IdSpec,
	__v: Joi.number()
}).label("PlacePlus");

export const PlaceResponseSpec = PlaceSpecPlus.keys({
}).label("PlaceResponse");

export const PlaceArraySpec = Joi.array().items(PlaceSpecPlus).label("PlaceArray");

export const PlaceResponseArraySpec = Joi.array().items(PlaceResponseSpec).label("PlaceResponseArray");

export const PoiSpec = Joi.object()
	.keys({
		name: Joi.string().required().example("Favourite historical sites"),
		userid: IdSpec,
		places: PlaceArraySpec
	})
	.label("Poi");

export const PoiSpecPlus = PoiSpec.keys({
	_id: IdSpec,
	__v: Joi.number()
}).label("PoiPlus");

export const JwtAuth = Joi.object().keys({
	success: Joi.boolean().example("true").required(),
	token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required()
});

export const PoiArraySpec = Joi.array().items(PoiSpecPlus).label("PoiArray");
