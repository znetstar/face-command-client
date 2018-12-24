import { IAppResources } from "face-command-common";
import { Client as RPCClient, MsgPackSerializer, WebSocketClientTransport } from "multi-rpc-browser";

/**
 * Common resources used through the application, namely, the connection to the RPC server.
 */
export default class AppResources implements IAppResources {
    /**
     * The RPC client.
     */
    public rpcClient: RPCClient;

    /**
     * Contains the WebSocket connection to the RPC server.
     */
    protected transport: WebSocketClientTransport;

    /**
     * The MsgPack serializer used to serialize/deserialize RPC Messages.
     */
    protected serializer: MsgPackSerializer = new MsgPackSerializer();

    /**
     * @param url - URL to the RPC server.
     */
    constructor(url: string) {
        this.transport = new WebSocketClientTransport(this.serializer, url);
        this.rpcClient = new RPCClient(this.transport);
    }
}