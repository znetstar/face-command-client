const { RunCondition, Command, Face } = require("face-command-common");
const chance = require('chance')();
const { assert } = require("chai");
const { setupServer, setupAppResources, fake, randomBytes } = require("./common");
const { CommandService, RPCModels } = require("../lib");

describe("CommandService", function () {
    describe("#PreprocessRunConditions", function () {
        it("Run conditions should contain the appropriate fields. Faces attached to the condition should be stripped to an id", function () {
            const faceIds = [];

            const runConditions = fake.runConditions();
                
            const rpcRunConditions = CommandService.PreprocessRunConditions(runConditions);

            for (let i = 0; i < 0; i++){
                const rpcRunCondition = rpcRunConditions[i];
                const runCondition = runConditions[i];

                assert.equal(rpcRunCondition.runConditionType, runCondition.runConditionType);
                assert.equal(rpcRunCondition.id, runCondition.id);
                assert.equal(rpcRunCondition.commandId, runCondition.commandId);

                assert.isNotEmpty(rpcRunCondition.facesToRecognize, "Faces to recognize was empty");
                const faceId = rpcRunCondition.facesToRecognize[0];
                assert.isNumber(faceId, "Face was not a number (face id)");   
                assert.equal(faceId, faceIds[i]);
            }
        });
    });

    describe("#AddCommand", function () {
        it("Should send a command to the server", async function () {
            const { server, port, httpServer } = await setupServer();
            const resources = setupAppResources(port);
            const cmdSvc = new CommandService(resources);

            const id = chance.integer();
            const data = randomBytes();
            const command = fake.command();
            command.id = id;
            command.data = data;
                
            server.methods['commands.AddCommand'] = async (commandTypeName, runConditions, name, data) => {
                command.runConditions = CommandService.PreprocessRunConditions(command.runConditions);
                const rpcCommand = new Command(id, name, commandTypeName, runConditions, data);
                assert.deepEqual(rpcCommand, command);
                return command;
            };

            const rpcCommand = await cmdSvc.AddCommand(command.type, command.runConditions, command.name, data);
        });
    });


    describe("#GetCommand", function () {
        it("Should retireve a command from the server", async function () {
            const { server, port } = await setupServer();
            const resources = setupAppResources(port);
            const cmdSvc = new CommandService(resources);

            const command = fake.command();
            
            server.methods['commands.GetCommand'] = async (commandId) => {
                assert.equal(commandId, command.id, "Command ID sent did not match the original command ID");
                return command;
            };

            const returnCommand = await cmdSvc.GetCommand(command.id);
            assert.deepEqual(returnCommand, command, "Command returned was not equal to the command sent.");
        });
    });


    describe("#GetCommands", function () {
        it("Should retireve all commands from the server", async function () {
            const { server, port } = await setupServer();
            const resources = setupAppResources(port);
            const cmdSvc = new CommandService(resources);

            const commands = fake.commands();
            
            server.methods['commands.GetCommands'] = async () => {
                return commands;
            };

            const returnCommands = await cmdSvc.GetCommands();

            assert.equal(returnCommands.length, commands.length, "Number of returned commands did not equal the number originally created");

            let i = 0;
            while (returnCommands.length) {
                const returnedCommand = returnCommands.shift();

                assert.deepEqual(returnedCommand, commands[i++]);
            }
        });
    });


    describe("#UpdateCommand", function () {
        it("Should update a command on the server", async function () {
            const { server, port } = await setupServer();
            const resources = setupAppResources(port);
            const cmdSvc = new CommandService(resources);

            const command = fake.command();
            
            server.methods['commands.UpdateCommand'] = async (commandDelta) => {
                commandDelta.name = chance.string();
                return commandDelta;
            };

            const returnCommand = await cmdSvc.UpdateCommand(command);
            assert.equal(returnCommand.id, command.id, "Command returned was not equal to the command sent.");
            assert.notDeepEqual(returnCommand, command);
        });
    });
});