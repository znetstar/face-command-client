import { Face, Command, RunCondition, Status, LogEntry } from "face-command-common";

/**
 * Processes objects sent from the RPC server.
 */
export default class RPCModels {
    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCFace(rpcFace: any): Face {
        if (typeof(rpcFace) === 'undefined' || rpcFace === null) 
            return rpcFace;

        return new Face(rpcFace.id, rpcFace.name, rpcFace.image, rpcFace.autostart);
    }

    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCRunCondition(rpcRunCondition: any) {
        if (typeof(rpcRunCondition) === 'undefined' || rpcRunCondition === null) 
            return rpcRunCondition;

        const faces: Face[] = rpcRunCondition.facesToRecognize ? rpcRunCondition.facesToRecognize.map(RPCModels.FromRPCFace) : rpcRunCondition.facesToRecognize;
        return new RunCondition(rpcRunCondition.runConditionType, faces, rpcRunCondition.id, rpcRunCondition.commandId)
    }

    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCCommand(rpcCommand: any): Command {
        if (typeof(rpcCommand) === 'undefined' || rpcCommand === null) 
            return rpcCommand;

        const conditions: RunCondition[] = [];

        return new Command(rpcCommand.id, rpcCommand.name, rpcCommand.type, rpcCommand.runConditions.map(RPCModels.FromRPCRunCondition), rpcCommand.data);
    }

    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCStatus(rpcStatus: any): Status {
        if (typeof(rpcStatus) === 'undefined' || rpcStatus === null) 
            return rpcStatus;

        return new Status(rpcStatus.id, rpcStatus.statusType, rpcStatus.time, rpcStatus.brightness, rpcStatus.recognizedFaces);
    }

    /**
     * Converts RPC object.
     * @param rpcLogEntry - RPC Object to convert
     */
    public static FromRPCLogEntry(rpcLogEntry: any): LogEntry {
        if (typeof(rpcLogEntry) === 'undefined' || rpcLogEntry === null) 
            return rpcLogEntry;

        return new LogEntry(rpcLogEntry.message, rpcLogEntry.level, new Date(rpcLogEntry.date), rpcLogEntry.meta, rpcLogEntry.id);
    }
}