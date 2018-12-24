import { CommandServiceBase, Face, RunCondition, Command, Status } from "face-command-common";
import AppResources from "./AppResources";
import RPCModels from "./RPCModels";

/**
 * Manages commands.
 */
export default class CommandService extends CommandServiceBase {
    /**
     * 
     * @param resources - Resources shared throughout the application.
     */
    constructor (protected resources: AppResources) {
        super(resources);
    }

    /**
     * Readies run conditions for the RPC call.
     * @param runConditions - Run conditions to process.
     */
    private static PreprocessRunConditions(runConditions: RunCondition[]): any[] {
        return runConditions.map((condition: RunCondition): any => {
            const { runConditionType, id, commandId } = condition;
            
            return {
                runConditionType,
                id,
                commandId,
                facesToRecognize: condition.facesToRecognize ? condition.facesToRecognize.map((face: Face) => face.id) : condition.facesToRecognize
            }; 
        });
    }

    /**
     * Stores a command to be run if the provided run conditions are met.
     * @param commandTypeName - Name of the CommandType that will be run.
     * @param runConditions - Conditions to meet for the command to run.
     * @param name - Unique name of the command.
     * @param data - Arbitrary data to pass to the command. 
     * @async
     */
    public async AddCommand(commandTypeName: string, runConditions: RunCondition[], name: string, data?: any): Promise<Command> {
        const rpcCommand = await this.resources.rpcClient.invoke("commands.AddCommand", [ commandTypeName, CommandService.PreprocessRunConditions(runConditions), name, data ]);
        return RPCModels.FromRPCCommand(rpcCommand);
    }

    /**
     * Retrieves a stored command.
     * @param id - ID of the command to retrieve.
     * @async
     */
    public async GetCommand(id: number): Promise<Command> {
        const rpcCommand = await this.resources.rpcClient.invoke("commands.GetCommand", [ id ]);
        return RPCModels.FromRPCCommand(rpcCommand);
    }

    /**
     * Retrives all stored commands.
     * @async
     */
    public async GetCommands(): Promise<Command[]> {
        const rpcCommands = await this.resources.rpcClient.invoke("commands.GetCommands", [ ]);
        return rpcCommands.map(RPCModels.FromRPCCommand);
    }

    /**
     * Updates a stored command.
     * @param commandDelta - Command to update.
     * @async
     */
    public async UpdateCommand(commandDelta: Command): Promise<Command> {
        commandDelta.runConditions = CommandService.PreprocessRunConditions(commandDelta.runConditions);
        const rpcCommand = await this.resources.rpcClient.invoke("commands.UpdateCommand", [ commandDelta ]);
        return RPCModels.FromRPCCommand(rpcCommand);
    }

    /**
     * Removes a stored command.
     * @param commandId - ID of the command to remove.
     * @async
     */
    public async RemoveCommand(commandId: number): Promise<void> {
        await this.resources.rpcClient.invoke("commands.RemoveCommand", [ commandId ]);
    }

    /**
     * Retrives a list of all CommandTypes.
     * @async
     */
    public async GetCommandTypeNames(): Promise<string[]> {
        return await this.resources.rpcClient.invoke("commands.GetCommandTypeNames", []) as string[];
    }
}