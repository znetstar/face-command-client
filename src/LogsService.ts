import { LogsServiceBase } from "face-command-common";
import AppResources from "./AppResources";
import RPCModels from "./RPCModels";

/**
 * Logs are sent via this service.
 */
export default class LogsService extends LogsServiceBase {
    /**
     *@param resources - Common resources of the application.
     */
    constructor(protected resources: AppResources) {
        super(resources);
        this.resources.rpcClient.on("logs.LogEntry", (rpcLogEntry: any) => {
            this.emit("LogEntry", RPCModels.FromRPCLogEntry(rpcLogEntry));
        });
    }   

    /**
     * Returns past logs.
     * @param start - Will be passed to winston.
     * @async
     */
    public async StreamHistory(start: number = -1): Promise<void> {
        return await this.resources.rpcClient.invoke("logs.StreamHistory", [ start ]);
    }
}