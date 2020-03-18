const sequelize = require('sequelize');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const postgresqlSequelize = new sequelize(process.env.POSTGRE_URL);

// MODEL
const postgresqlDataSchema = postgresqlSequelize.define('try_arrays', {
	id: {
		field: 'id',
		type: sequelize.INTEGER,
		primaryKey: true, 
		autoIncrement : true
	},
	name: {
		field: 'name',
		type: sequelize.STRING
	},
	email: {
		field: 'email',
		type: sequelize.STRING,
		allowNull: false,
		validate: {
	        isEmail: { args: true, msg: "Please enter a valid email address" }
      	},
      	unique: { args: true, msg: "Email already exists" }
	},
	password: {
		field: 'password',
		type: sequelize.STRING
	},
	tokens: {
		field: 'tokens',
		type: sequelize.ARRAY(sequelize.TEXT)
	},
	createdAt: {
		field: 'created_at',
		type: sequelize.DATE
	},
	updatedAt: {
		field: 'updated_at',
		type: sequelize.DATE
	}
},{
	timestamp: true,
	hooks: {
		beforeCreate: (user) => {
	    const salt = bcrypt.genSaltSync();
	    user.password = bcrypt.hashSync(user.password, salt);
	  }
	}
})

postgresqlDataSchema.prototype.setToken = async function() {
    const user = this;
    const token = jwt.sign({email: user.email}, process.env.JWT_KEY);
    let arr = user.tokens || [] ;
    user.token == null ? arr.push(token) : arr.concat(token);
    user.tokens= arr;
    await user.save();
    return token;
}

postgresqlDataSchema.findByCredentials = async function(email, password) {
	const user = await postgresqlDataSchema.findOne({email});
    if (!user){
        throw new Error({ error: 'Invalid login credentials' });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch){
        throw new Error({ error: 'Invalid login credentials' })
    }
    return user;
}

module.exports = postgresqlDataSchema;
