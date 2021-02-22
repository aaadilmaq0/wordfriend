const config = require("./config/config");
const mongoose = require("mongoose");

try{
    mongoose.connect(config.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
}catch(error){
    console.log("Error while connecting to MongoDB using Mongoose");
    console.log(error);
    process.exit(1);
}

module.exports = mongoose;