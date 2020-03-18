const express = require('express');
const User = require('../models/postgresql.user');
const auth = require('../middleware/pg.auth');

const router = express.Router();

router.post('/pg/users', async (req, res) => {
	try{
		const user = new User(req.body);
		await user.save();
		const token = await user.setToken();
		res.status(201).send({user, token});
	}catch(error){
 		res.status(400).send(error);
 		console.log(error)
	}
})

router.post('/pg/users/login', async (req, res) => {
    // Login a registered user
    try{
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        if(!user) {
            return res.status(401).send({ error: 'Login failed! Check authenticatioan credentials' });
        }
        const token = await user.setToken();
        res.send({ user, token });
    } catch(error){
        res.status(400).send(error);
        console.log(error)
    }
})

router.get('/pg/users/me', auth, async (req, res) => {
    // View logged in user profile
    res.send(req.user);
})

router.post('/pg/users/me/logout', auth, async (req, res) => {
    // Log user out ogf the application
    try{
    	let user = await User.findOne({
    		where: {
    			id: req.user.id,
    			email: req.user.email
    		}
    	});
        user.tokens = user.tokens.filter((token) => {
            return token != req.token;
        });
        await user.save();
        res.send();
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

router.post('/pg/users/me/logoutall', auth, async (req, res) => {
    // Log user out of all devices
    try{
    	let user = await User.findOne({
    		where: {
    			id: req.user.id,
    			email: req.user.email
    		}
    	});
        user.tokens = [];
        await user.save();
        res.send();
    }catch (error){
        res.status(500).send(error);
        console.log(error)
    }
})


module.exports = router;