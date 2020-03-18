let sequelize = require('sequelize');

require("dotenv").config();

let pgSequelize = new sequelize(process.env.POSTGRE_URL);
pgSequelize
	.authenticate()
	.then(() => {
		console.log('PostgreSQL sucessfully connected!');

		// // THREAD TEST(placed here on las execute task
		// run()
		// 	.then(() => {
		// 		console.log('Executed Successfuly');
		// 	})
		// 	.catch(error => {
		// 		console.error('Execute Failed: '+error);
		// 	});
	})
	.catch(error => {
		console.log('Could not connect to PostgreSQL: '+error);
	});
