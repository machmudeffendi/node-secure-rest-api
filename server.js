const express = require('express');
const userRouter = require('./routers/user');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 3000;
require('./db/db')

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})