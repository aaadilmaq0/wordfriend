module.exports = app => {
    app.use("/api/auth", require("./api/auth"));
    app.use("/api/trie", require("./api/trie"));
};