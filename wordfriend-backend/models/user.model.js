const mongoose = require("mongoose");
const user = {
    email: { type: String, required: true, unique: true, lowercase: true },
    firstName: { type: String, required: true, lowercase: true },
    lastName: { type: String, required: false, lowercase: true },
    lastRequest: { type: Date, required: true }
};

module.exports = mongoose.model("user", mongoose.Schema(user));