const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

var MailConfig = require('../config/email');
var hbs = require('nodemailer-express-handlebars');
var gmailTransport = MailConfig.GmailTransport;
var smtpTransport = MailConfig.SMTPTransport;

const router = express.Router();

router.post('/users', async (req, res) => {
    // Create a new user
    try{
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/users/login', async (req, res) => {
    // Login a registered user
    try{
         const { email, password } = req.body;
         const user= await User.findByCredentials(email, password);
         if(!user) {
             return res.status(401).send({ error: 'Login failed! Check authenticatioan credentials' });
         }
         const token = await user.generateAuthToken();
         res.send({ user, token });
    } catch(error){
        res.status(400).send(error);
        console.log(error)
    }
})

router.get('/users/me', auth, async (req, res) => {
    // View logged in user profile
    res.send(req.user);
})

router.post('/users/me/logout', auth, async (req, res) => {
    // Log user out ogf the application
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });
        await req.user.save();
        res.send();
    }catch(error){
        res.status(500).send(error);
        console.log(error);
    }
})

router.post('/users/me/logoutall', auth, async (req, res) => {
    // Log user out of all devices
    try{
        req.user.tokens.splice(0, req.user.tokens.length);
        await req.user.save();
        res.send();
    }catch (error){
        res.status(500).send(error);
    }
})

router.get('/users/email/template', (req, res, next) => {
  MailConfig.ViewOption(gmailTransport,hbs);
  let HelperOptions = {
    from: 'machmudeffendi01@gmail.com',
    to: 'machmudeffendi0@gmail.com',
    subject: 'Hellow world!',
    template: 'test',
    context: {
      name:"Machmud effendi",
      email: "machmudeffendi01@gmail.com",
      address: "Yogyakarta, Indonesia"
    }
  };
  gmailTransport.sendMail(HelperOptions, (error,info) => {
    if(error) {
      console.log(error);
      res.json(error);
    }
    console.log("email is send");
    console.log(info);
    res.json(info)
  });
});

router.get('/users/email/smtp/template', (req, res, next) => {
  MailConfig.ViewOption(smtpTransport,hbs);
  let HelperOptions = {
    from: '"Tariqul islam" <tariqul@falconfitbd.com>',
    to: 'tariqul.islam.rony@gmail.com',
    subject: 'Hellow world!',
    template: 'test',
    context: {
      name:"tariqul_islam",
      email: "tariqul.islam.rony@gmail.com",
      address: "52, Kadamtola Shubag dhaka"
    }
  };
  smtpTransport.verify((error, success) => {
      if(error) {
        res.json({output: 'error', message: error})
        res.end();
      } else {
        smtpTransport.sendMail(HelperOptions, (error,info) => {
          if(error) {
            res.json({output: 'error', message: error})
          }
          res.json({output: 'success', message: info});
          res.end();
        });
      }
  })
  
});

module.exports = router;