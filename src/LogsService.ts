import { LogsServiceBase, LogEntry } from "face-command-common";
import AppResources from "./AppResources";

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
            this.emit("LogEntry", new LogEntry(rpcLogEntry.message, rpcLogEntry.level, new Date(rpcLogEntry.date), rpcLogEntry.meta));
        });
    }   

    /**
     * Returns past logs.
     * @param start - Will be passed to winston.
     * @async
     */
    public async StreamHistory(start: number = -1): Promise<void> {
        await this.resources.rpcClient.invoke("logs.StreamHistory", [ start ]);
    }
}