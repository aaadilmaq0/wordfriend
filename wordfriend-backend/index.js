// Getting Express App
const app = require("./app");

// Starting Server & Handling Events
require("./server")(app);

// Configure Mongoose
require("./mongo");

// Creating Global Trie
require("./trie");

// Creating Routes
require("./routes")(app);

// Starting Scheduled Workers
require("./workers");