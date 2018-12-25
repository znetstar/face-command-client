
const chance = require('chance')();
const { assert } = require("chai");
const { DetectionOptions, EigenFaceRecognizerOptions } = require("face-command-common");
const { Notification } = require("multi-rpc")
const { setupServer, setupAppResources, fake } = require("./common");
const { DetectionService } = require("../lib");

describe("ConfigService", function () {
    describe("⚡StatusChange", function () {
        it("Event should fire if the RPC Server sends a detection.StatusChange notification", async function () {
            const { server, port } = await setupServer();
            const detection = new DetectionService(setupAppResources(port));
            const status = fake.status();
            await detection.resources.rpcClient.connect();

            return new Promise((resolve, reject) => {
                detection.once("StatusChange", (rpcStatus) => {
                    assert.deepEqual(rpcStatus, status);

                    resolve();
                });


                server.sendAll(new Notification("detection.StatusChange",[ status ]));
            });
        });
    });

    describe("⚡DetectionRunning", function () {
        it("Event should fire if the RPC Server sends a detection.DetectionRunning notification", async function () {
            const { server, port } = await setupServer();
            const detection = new DetectionService(setupAppResources(port));
            const isRunning = chance.bool();

            await detection.resources.rpcClient.connect();

            return new Promise((resolve, reject) => {
                detection.once("DetectionRunning", (detectionRunning) => {
                    assert.deepEqual(detectionRunning, isRunning);

                    resolve();
                });


                server.sendAll(new Notification("detection.DetectionRunning",[ isRunning ]));
            });
        });
    });

    describe("#StartDetection", async function () {
        it("The detection options should contain the required fields", async function () {
            const { server, port } = await setupServer();
            const detection = new DetectionService(setupAppResources(port));
            const eigenOptions = new EigenFaceRecognizerOptions(chance.floating(), chance.floating());
            const faces = fake.faces();
            const options = new DetectionOptions(chance.floating(), eigenOptions, faces);
            
            server.methods["detection.StartDetection"] = async (rpcOptions) => {
                assert.deepEqual(options.eigenFaceRecognizerOptions, rpcOptions.eigenFaceRecognizerOptions);
                assert.equal(options.frequency, rpcOptions.frequency);
                assert.isNotEmpty(rpcOptions.faces);
                assert.equal(options.faces[0].id, rpcOptions.faces[0])
            };

            await detection.StartDetection(options);
        });
    });

    describe("#StatusHistory", async function () {
        it("Should return a list of status objects", async function () {
            const { server, port } = await setupServer();
            const detection = new DetectionService(setupAppResources(port));
            const statuses = fake.statuses();

            server.methods["detection.StatusHistory"] = async () => statuses

           const rpcStatuses = await detection.StatusHistory();
           assert.deepEqual(rpcStatuses, statuses);
        });
    });
});