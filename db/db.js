const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
    poolSize: 10,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongodb Successfully connected!");
},error => {
    console.log("Could not connect to mongodb: "+ error);
});