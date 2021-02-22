const config = require("./config/config");

module.exports = app => {

    const http = require("http");
    const server = http.createServer(app);
    server.listen(config.port);
    
    // Handling Server Listening Event
    server.on("listening", ()=>{
        console.log(`Express Server listeing on port ${config.port}`);
    });

    // Handling Errors
    server.on("error", error => {
        if(error.syscall && error.syscall !== "listen"){
            throw error;
        }
        switch(error.code){
            case "EACCES":
                console.error(`Port ${config.port} requires elevated privilages`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(`Port ${config.port} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    });

};