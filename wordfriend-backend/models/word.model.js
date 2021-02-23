const mongoose = require("mongoose");
const word = {
    name: { type: String, required: true, unique: true, lowercase: true },
    meaning: { type: String, required: true, lowercase: true },
    example: { type: String, required: false, lowercase: true },
    user: { type: String, required: true }
};

module.exports = mongoose.model("word", mongoose.Schema(word));