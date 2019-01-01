
const Random = require("face-command-common/lib/Random").default;
const getPort = require("get-port");
const HTTPServer = require("http").Server;
const { AppResources } = require("../lib");

module.exports.setupServer = async () => {
    const { Server, MsgPackSerializer, WebSocketTransport } = require("multi-rpc");
    const port = await getPort();
    const httpServer = new HTTPServer((req,res) => { res.end(); });
    const transport = new WebSocketTransport(new MsgPackSerializer(), httpServer);
    const server = new Server(transport);
    
    httpServer.listen(port);
    return { httpServer, port, transport, server };
};

module.exports.setupAppResources = (port) => {
    const { WebSocketClientTransport } = require("multi-rpc-websocket-client-side-transport");
    const { MsgPackSerializer } = require("multi-rpc-msgpack-serializer");
    return new AppResources(new WebSocketClientTransport(new MsgPackSerializer(), `ws://localhost:${port}`));
};

module.exports.fake = new Random();