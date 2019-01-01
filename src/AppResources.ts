import { IAppResources } from "face-command-common";
import { Client as RPCClient } from "multi-rpc-core";
import { Transport } from "multi-rpc-common";

/**
 * Common resources used through the application, namely, the connection to the RPC server.
 */
export default class AppResources implements IAppResources {
    /**
     * The RPC client.
     */
    public rpcClient: RPCClient;

    /**
     * @param url - URL to the RPC server.
     */
    constructor(protected transport: Transport) {
        this.rpcClient = new RPCClient(this.transport);
    }
}