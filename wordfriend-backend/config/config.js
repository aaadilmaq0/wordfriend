var config = {
    mongodb: process.env.mongodb,
    port: Number(process.env.port),
    mode: process.env.mode
};
module.exports = config;