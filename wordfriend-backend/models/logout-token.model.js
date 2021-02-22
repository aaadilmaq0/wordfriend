const mongoose = require("mongoose");
const logouttoken = {
    token: { type: String, required: true, unique: true }
};

module.exports = mongoose.model("logouttoken", mongoose.Schema(logouttoken));