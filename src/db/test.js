module.exports = {
	poolData: {
		user: "postgres",
		password: "mysecpass",
		database: "indintdb",
		port: "5432",
		host: process.env.DOCKERCOMPOSE ? "postgres" : "localhost" 		
	}
}
