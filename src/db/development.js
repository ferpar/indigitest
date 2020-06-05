module.exports = {
	poolData: {
		user: "postgres",
		password: "mysecpass",
		database: "indigitest",
		port: "5432",
		host: process.env.DOCKERCOMPOSE ? "postgres" : "localhost"		
	}
}

