
const { assert } = require("chai");
const { Notification } = require("multi-rpc");
const { setupServer, setupAppResources, fake } = require("./common");
const { LogsService } = require("../lib");

describe("LogsService", function () {
    describe("⚡LogEntry", function () {
        it("Event should fire if the RPC Server sends a logs.LogEntry notification", async function () {
            const { server, port } = await setupServer();
            const logs = new LogsService(setupAppResources(port));
            const logEntry = fake.logEntry();

            await logs.resources.rpcClient.connect();

            return new Promise((resolve, reject) => {
                logs.once("LogEntry", (rpcLogEntry) => {
                    assert.deepEqual(rpcLogEntry, logEntry);

                    resolve();
                });


                server.sendAll(new Notification("logs.LogEntry",[ logEntry ]));
            });
        });
    });

    describe("#StreamHistory", async function () {
        it("Should return a list of log entries", async function () {
            const { server, port } = await setupServer();
            const logs = new LogsService(setupAppResources(port));
            const logEntries = fake.logEntries();

            server.methods["logs.StreamHistory"] = async () => logEntries;

           const rpcEntries = await logs.StreamHistory();
           assert.deepEqual(rpcEntries, logEntries);
        });
    });
});