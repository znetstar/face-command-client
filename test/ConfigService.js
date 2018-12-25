
const chance = require('chance')();
const { assert } = require("chai");
const { setupServer, setupAppResources } = require("./common");
const { ConfigService } = require("../lib");

describe("ConfigService", function () {
    describe("#GetConfigValue", function () {
        it("Should retrieve a configuration property", async function () {
            const { server, port } = await setupServer();
            const config = new ConfigService(setupAppResources(port));
            
            const key = chance.string();
            const configStore = new Map();
            configStore.set(key, chance.string());

            server.methods["config.GetConfigValue"] = async (key) => {
                return configStore.get(key);
            };

            const value = await config.GetConfigValue(key);

            assert.equal(value, configStore.get(key));
        });
    });

    describe("#SetConfigValue", function () {
        it("Should set a configuration property", async function () {
            const { server, port } = await setupServer();
            const config = new ConfigService(setupAppResources(port));
            
            const key = chance.string();
            const value = chance.string();
            const configStore = new Map();

            server.methods["config.SetConfigValue"] = async (key, value) => {
                configStore.set(key, value);
            };

            await config.SetConfigValue(key, value);

            assert.equal(configStore.get(key), value);
        });
    });

    describe("#GetConfig", function () {
        it("Should return an object with all configuration properties", async function () {
            const { server, port } = await setupServer();
            const config = new ConfigService(setupAppResources(port));
        
            const configStore = {};

            for (let i = 0; i < 10; i ++) {
                configStore[chance.string()] = chance.string();
            }

            server.methods["config.GetConfig"] = async (key, value) => {
                return configStore;
            };

            const rpcConfig = await config.GetConfig();

            assert.deepEqual(rpcConfig, configStore);
        });
    });

    describe("#SetConfig", function () {
        it("Should overwrite the config properties of the new property", async function () {
            const { server, port } = await setupServer();
            const config = new ConfigService(setupAppResources(port));
        
            const configStore = { };
            const newConfig = {};
            for (let i = 0; i < 10; i ++) {
                const key = chance.string();
                configStore[key] = chance.string();
                newConfig[key] = chance.string();
            }

            server.methods["config.SetConfig"] = async (object, parentKey) => {
                for (let key in object)
                    configStore[key] = object[key];
            };

            await config.SetConfig(newConfig);

            assert.deepEqual(configStore, newConfig);
        });
    });
});