const app = require('./app');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
// const connectDB = require('./config/db');

dotenv.config({ path: '.env' });
// console.log(process.env.MONGO_URL);

mongoose.connect(process.env.MONGO_URL).then(db => {
    console.log('connected to db');
}).catch(err => {
    console.log(err.message);
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT,()=>{
    console.log('working on port ',PORT);
});