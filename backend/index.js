const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

const connectDB = require('./db');
const authRoutes = require('./authroutes');
const crudRoutes = require('./crud');

connectDB();

app.use(cors());
app.use(bodyParser.json());


app.use('/', authRoutes);
app.use('/', crudRoutes); 

app.listen(5000, () => {
    console.log("Server is running")
});