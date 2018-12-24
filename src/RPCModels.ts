import { Face, Command, RunCondition, Status } from "face-command-common";

/**
 * Processes objects sent from the RPC server.
 */
export default class RPCModels {
    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCFace(rpcFace: any): Face {
        return new Face(rpcFace.id, rpcFace.name, rpcFace.image, rpcFace.autostart);
    }

    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCRunCondition(rpcRunCondition: any) {
        const faces: Face[] = rpcRunCondition.facesToRecognize ? rpcRunCondition.facesToRecognize.map(RPCModels.FromRPCFace) : rpcRunCondition.facesToRecognize;
        return new RunCondition(rpcRunCondition.runConditionType, faces, rpcRunCondition.id, rpcRunCondition.commandId)
    }

    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCCommand(rpcCommand: any): Command {
        const conditions: RunCondition[] = [];

        return new Command(rpcCommand.id, rpcCommand.name, rpcCommand.type, rpcCommand.runConditions.map(RPCModels.FromRPCRunCondition));
    }

    /**
     * Converts RPC object.
     * @param rpcFace - RPC Object to convert.
     */
    public static FromRPCStatus(rpcStatus: any): Status {
        return new Status(rpcStatus.id, rpcStatus.statusType, rpcStatus.time, rpcStatus.recognizedFaces);
    }
}