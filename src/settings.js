module.exports = {
	DATABASE_URL: `mongodb+srv://${process.env.dbUsername}:${
		process.env.dbPassword
	}@sketchboardcluster.sapua.mongodb.net/${
		process.env.dbName
	}?retryWrites=true&w=majority`
};