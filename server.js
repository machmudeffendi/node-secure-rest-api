const express = require('express');
const userRouter = require('./routers/user');
const pgRouer = require('./routers/pg.user');
const cors = require('cors');

require('dotenv').config();

const port = process.env.PORT || 3000;
require('./db/db')
require('./db/postgree.db')

const app = express();

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(pgRouer);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})