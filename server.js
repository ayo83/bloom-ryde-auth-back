const express = require('express');
require('dotenv').config();
const connectDB = require('./src/database/database');
const adminRouter = require('./src/router/admin');
const bodyParser = require('body-parser');
const cors = require('cors');


// Initializing Express Framework
const app = express();

// Connecting DB
connectDB();

// Defining Port
const port = process.env.PORT;

// MIDDLEWARE
// app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// My Routers
app.use(adminRouter);


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});

