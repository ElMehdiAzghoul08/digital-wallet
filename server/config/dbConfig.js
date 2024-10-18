require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.mongo_url)

const connectionResult = mongoose.connection;

connectionResult.on('error', () =>{
    console.log('error failed to connect to database');
});
connectionResult.on('connected' ,  ()=>{
    console.log('connected to MongoDB database');
});

module.exports = connectionResult;