export const seedData = {
	users: {
		_model: "User",
		homer: {
			firstName: "Homer",
			lastName: "Simpson",
			email: "homer@simpson.com",
			password: "secret",
			scope: ["admin", "user"]
		},
		marge: {
			firstName: "Marge",
			lastName: "Simpson",
			email: "marge@simpson.com",
			password: "secret"
		},
		bart: {
			firstName: "Bart",
			lastName: "Simpson",
			email: "bart@simpson.com",
			password: "secret"
		}
	},
	pois: {
		_model: "Poi",
		cork: {
			name: "",
			userid: "->users.bart"
		}
	},
	places: {
		_model: "Place",
		place_1: {
			name: "The Glucksman",
			description: "Contemporary art gallery on the grounds of University College Cork",
			location: {
				latitude: 51.895495970732824,
				longitude: -8.490267726987343,
			},
			poiid: "->pois.cork"
		},
		place_2: {
			name: "English Market",
			description: "Vibrant food market in the heart of Cork city",
			location: {
				latitude: 51.89789771896542,
				longitude: -8.474833592837065,
			},
			poiid: "->pois.cork"
		},
		place_3: {
			name: "Saint Fin Barre's Cathedral",
			description: "Gothic revival cathedral on the south side of Cork city",
			location: {
				latitude: 51.894945336063174,
				longitude: -8.480138242328158,
			},
			poiid: "->pois.cork"
		}
	}
};
