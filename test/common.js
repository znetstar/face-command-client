const { Server, MsgPackSerializer, WebSocketTransport } = require("multi-rpc");
const { Face, Command, RunCondition, Status, LogEntry } = require("face-command-common");
const { cloneDeep } = require("lodash");
const getPort = require("get-port");
const HTTPServer = require("http").Server;
const chance = require("chance")();
const { randomBytes } = require("crypto");
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

module.exports.randomRunConditionType = () => chance.integer({ min: 0, max: 6 });
module.exports.randomStatusType = () => chance.integer({ min: 0, max: 4 });
module.exports.randomBytes = () => new Uint8Array(randomBytes(chance.integer({ min: 8, max: 256 })));
const fake = {
    face: () => new Face(chance.integer(), chance.string(), exports.randomBytes(), chance.bool())
    ,rpcFace: () => cloneDeep(fake.face())
    ,faces: () => {
        const faces = [];
        for (let i = 0; i < chance.integer({ min: 5, max: 50 }); i++) {
            faces.push(fake.face())
        }
        return faces;
    }
    ,runCondition:  () =>  new RunCondition(exports.randomRunConditionType(), fake.faces(), chance.integer(), chance.integer())
    ,rpcRunCondition: () => cloneDeep(fake.runCondition())
    ,runConditions: () => {
        const runConditions = [];
        for (let i = 0; i < chance.integer({ min: 1, max: 6 }); i++) {
            runConditions.push(fake.runCondition());
        }
        return runConditions;
    }
    ,command: () => new Command(chance.integer(), chance.string(), chance.string(), fake.runConditions())
    ,rpcCommand: () => cloneDeep(fake.command())
    ,commands: () => {
        const commands = [];
        for (let i = 0; i < chance.integer({ min: 5, max: 50 }); i++) {
            commands.push(fake.command())
        }
        
        return commands;
    }
    ,status: () =>  new Status(chance.integer(), exports.randomStatusType(), chance.date(), fake.faces())
    ,rpcStatus: () => cloneDeep(fake.status())
    ,statuses: () => {
        const statuses = [];
        for (let i = 0; i < chance.integer({ min: 5, max: 50 }); i++) {
            statuses.push(fake.status())
        }
        return statuses;
    }
    ,logEntry: () => {
        const meta = {};
        meta[chance.string()] = chance.string();
        return new LogEntry(chance.string(), chance.string(), chance.date(), meta);
    }
    ,rpcLogEntry: () => cloneDeep(fake.logEntry)
    ,logEntries: () => {
        const entries = [];
        for (let i = 0; i < chance.integer({ min: 5, max: 50 }); i++) {
            entries.push(fake.logEntry())
        }
        return entries;       
    }
};
module.exports.fake = fake;