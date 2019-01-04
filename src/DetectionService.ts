import { DetectionServiceBase, DetectionOptions, Status} from "face-command-common";
import AppResources from "./AppResources";
import RPCModels from "./RPCModels";

/**
 * Represents a service that will monitor the capture source for faces or lack thereof.
 */
export default class DetectionService extends DetectionServiceBase {
    /**
     * @param resources - Common resources of the application.
     */
    constructor (protected resources: AppResources) {
        super(resources);

        this.resources.rpcClient.on("detection.StatusChange", (rpcStatus: any) => {
            this.emit("StatusChange", RPCModels.FromRPCStatus(rpcStatus));
        });

        this.resources.rpcClient.on("detection.DetectionRunning", (running: boolean) => {
            this.emit("DetectionRunning", running);
        });
    }

    /**
     * Returns the last status.
     */
    public async GetLastStatus(): Promise<Status> {
        return await RPCModels.FromRPCStatus(this.resources.rpcClient.invoke("detection.GetLastStatus", []));
    }

    /**
     * Indicates if detection is currently running.
     */
    public async IsDetectionRunning(): Promise<boolean> {
        return await this.resources.rpcClient.invoke("detection.IsDetectionRunning", []);
    }

    /**
     * Begins capturing from the capture source.
     * @param options - Options for detection.
     */
    public async StartDetection(options: DetectionOptions): Promise<void> {
        const { eigenFaceRecognizerOptions, faces, frequency } = options;
        const rpcOptions: any = {
            eigenFaceRecognizerOptions,
            frequency,
            faces: faces.map((face) => face.id)
        };

        return await this.resources.rpcClient.invoke("detection.StartDetection", [ rpcOptions ]);
    }

    /**
     * Stops capturing from the capture source
     */
    public async StopDetection(): Promise<void> {
        return await this.resources.rpcClient.invoke("detection.StopDetection", []);
    }
    
    /**
     * Searches for entries between a start and end date.
     * 
     * @param start - The start date for the query.
     * @param end - The end date for the query.
     * @async
     */
    public async StatusHistory(): Promise<Status[]> {
        const rpcStatuses = await this.resources.rpcClient.invoke("detection.StatusHistory", []);

        return rpcStatuses.map((rpcStatus: any): Status => RPCModels.FromRPCStatus(rpcStatus));
    }
}