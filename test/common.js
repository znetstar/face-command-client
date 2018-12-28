const { Server, MsgPackSerializer, WebSocketTransport } = require("multi-rpc");
const Random = require("face-command-common/lib/Random").default;
const getPort = require("get-port");
const HTTPServer = require("http").Server;
const { AppResources } = require("../lib");

module.exports.setupServer = async () => {
    const port = await getPort();
    const httpServer = new HTTPServer((req,res) => { res.end(); });
    const transport = new WebSocketTransport(new MsgPackSerializer(), httpServer);
    const server = new Server(transport);
    
    httpServer.listen(port);
    return { httpServer, port, transport, server };
};

module.exports.setupAppResources = (port) => {
    return new AppResources(`ws://127.0.0.1:${port}`);
};

module.exports.fake = new Random();