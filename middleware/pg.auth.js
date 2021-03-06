const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/postgresql.user');

require('dotenv').config();

const auth = async (req, res, next) => {
	try{
		const token = req.header('Authorization').replace('Bearer ', '');
		const data = jwt.verify(token, process.env.JWT_KEY);
		
		const user = await User.findOne({
          where: {
              email: data.email,
              tokens: { [Op.contains]: [token] }
          },
          raw: true
     	});
		if (!user) {
			throw new Error();
		}
		req.user = user;
		req.token = token;
		next();
	}catch(error){
		res.status(401).send({ error: 'Not authorized to access this resource' });
	}
}

module.exports = auth;