const cron = require("node-cron");
const logoutTokenModel = require("../models/logout-token.model");
const userModel = require("../models/user.model");

// Clean Logout Tokens from Database
cron.schedule("0 0 0 * * *", async () => {
    try{
        console.log("Running a job at 12 AM IST to clear all Logout Tokens!");
        await logoutTokenModel.deleteMany({}).exec();
        console.log("Cleared all Logout Tokens Successfully!")
    }catch(error){
        console.log(error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
}).start();

// Clean Global Trie
cron.schedule("0 0 */6 * * *", async () => {
    try{
        console.log("Running a job to clean the Global Trie");
        let currTime = new Date().getTime();
        currTime = currTime - 3 * 60 * 60 * 1000;
        let users = await userModel.find({ lastRequest: { $lt: currTime } }).select({ _id: 1 }).exec();
        users.forEach(user => delete trie.children[user._id.toString() ]);
        console.log("Cleaned the Global Trie");
    }catch(error){
        console.log(error);
    }
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
}).start();