import { ConfigServiceBase } from "face-command-common";
import AppResources from "./AppResources";

/**
 * Sets/retrieves configuration properties.
 */
export default class ConfigService extends ConfigServiceBase {
    /**
     * 
     * @param resources - Resources shared throughout the application.
     */
    constructor (protected resources: AppResources) {
        super(resources);
    }

    /**
     * Retrieves a configuration property.
     * @param key - Key of the property to retrieve.
     * @async
     */
    public async GetConfigValue(key: string): Promise<any> {
        return await this.resources.rpcClient.invoke("config.GetConfigValue", [key]);
    }

    /**
     * Sets a configuration property.
     * @param key - Key of the property to set.
     * @param value - Value to set the property to.
     * @async
     */
    public async SetConfigValue(key: string, value: any): Promise<void> {
        return await this.resources.rpcClient.invoke("config.SetConfigValue", [key, value]);
    }

    /**
     * Retrieves all configuration properties.
     * @async
     */
    public async GetConfig(): Promise<any> {
        return await this.resources.rpcClient.invoke("config.GetConfig", []);
    } 

    /**
     * Sets multiple configuration properties
     * @param object - An object containing keys and values to set.
     * @param parentKey - The key of the parent configuration property to apply the changes to. Defaults to the root object.
     * @async
     */
    public async SetConfig(object: any, parentKey?: string): Promise<any> {
        return await this.resources.rpcClient.invoke("config.SetConfig", [object, parentKey]);
    } 

    /**
     * Saves configuration to source.
     * @async
     */
    public async SaveConfig(): Promise<void> {
        return await this.resources.rpcClient.invoke("config.SaveConfig", []);
    }

    /**
     * Loads configuration from source.
     * @async
     */
    public async LoadConfig(): Promise<void> {
        return await this.resources.rpcClient.invoke("config.LoadConfig", []);
    }
}