const { Face, RunCondition, Command, Status, LogEntry } = require("face-command-common");
const { assert } = require("chai");
const chance = require("chance")();
const { fake } = require("./common");
const { RPCModels } = require("../lib");

function fakeRPCFace() {
    return {
        id: chance.integer(),
        name: chance.string(),
        image: randomBytes(),
        autostart: chance.bool()
    };
}

describe("RPCModels", function () {
    describe("#FromRPCFace()", function () {
        it("Should return a Face object with the provided fields", function () {
            const inputFace = fake.face();

            const face = RPCModels.FromRPCFace(inputFace);
            assert.instanceOf(face, Face);
            assert.deepEqual(face, inputFace);
        });

        it("Should return null if input is null", function () {
            const value = RPCModels.FromRPCFace(null);
            assert.isNull(value);
        });
    });

    describe("#FromRPCRunCondition()", function () {
        it("Should return a RunCondition object with the provided fields", function () {
            const inputCondition = fake.runCondition();

            const condition = RPCModels.FromRPCRunCondition(inputCondition);
            assert.instanceOf(condition, RunCondition);
            assert.deepEqual(condition, inputCondition);
        });

        it("Should return null if input is null", function () {
            const value = RPCModels.FromRPCRunCondition(null);
            assert.isNull(value);
        });
    });


    describe("#FromRPCCommand()", function () {
        it("Should return a Command object with the provided fields", function () {
            const inputCommand = fake.command();

            const command = RPCModels.FromRPCCommand(inputCommand);
            assert.instanceOf(command, Command);
            assert.deepEqual(command, inputCommand);
        });

        it("Should return null if input is null", function () {
            const value = RPCModels.FromRPCCommand(null);
            assert.isNull(value);
        });
    });


    describe("#FromRPCStatus()", function () {
        it("Should return a Status object with the provided fields", function () {
            const inputStatus = fake.status();

            const status = RPCModels.FromRPCStatus(inputStatus);
            assert.instanceOf(status, Status);
            assert.deepEqual(status, inputStatus);
        });

        it("Should return null if input is null", function () {
            const value = RPCModels.FromRPCStatus(null);
            assert.isNull(value);
        });
    });

    describe("#FromRPCLogEntry()", function () {
        it("Should return a LogEntry object with the provided fields", function () {
            const inputLogEntry = fake.logEntry();

            const logEntry = RPCModels.FromRPCLogEntry(inputLogEntry);
            assert.instanceOf(logEntry, LogEntry);
            assert.deepEqual(logEntry, inputLogEntry);
        });

        it("Should return null if input is null", function () {
            const value = RPCModels.FromRPCLogEntry(null);
            assert.isNull(value);
        });
    });
});