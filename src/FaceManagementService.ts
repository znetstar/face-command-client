import { FaceManagementServiceBase, Face } from "face-command-common";
import AppResources from "./AppResources";
import RPCModels from "./RPCModels";

/**
 * Represents a service that can manage faces stored by the application.
 */
export default class FaceManagementService extends FaceManagementServiceBase {
      /**
     *@param resources - Common resources of the application.
     */
    constructor (protected resources: AppResources) {
        super(resources);
    }

    /**
     * Adds face which will be extracted from the provided image.
     * @param image - Image to extract the face from.
     * @param name - Friendly name for the face.
     * @param autostart - If the face should be loaded on application start.
     * @async
     */
    public async AddFace(image: Uint8Array, name: string, autostart: boolean = false): Promise<Face> {
        const rpcFace = await this.resources.rpcClient.invoke("faceManagement.AddFace", [ image, name, autostart ]);
        return RPCModels.FromRPCFace(rpcFace);
    }

    /**
     * Adds a face from the capture source.
     * @param name - Friendly name for the face.
     * @param autostart - If the face should be loaded on application start.
     * @async
     */
    public async AddFaceFromCamera(name: string, autostart: boolean = false): Promise<Face> {
        const rpcFace = await this.resources.rpcClient.invoke("faceManagement.AddFaceFromCamera", [ name, autostart ]);
        return RPCModels.FromRPCFace(rpcFace);
    }

    /**
     * Retrieves a face by the its identifier.
     * @param id - The identifier of the face.
     * @async
     */
    public async GetFace(faceId: number): Promise<Face> {
        const rpcFace = await this.resources.rpcClient.invoke("faceManagement.GetFace", [ faceId ]);
        return RPCModels.FromRPCFace(rpcFace);
    }

    /**
     * Retrieves all faces.
     * @async
     */
    public async GetFaces(): Promise<Face[]> {
        const rpcFaces = await this.resources.rpcClient.invoke("faceManagement.GetFaces", [ ]);
        return rpcFaces.map(RPCModels.FromRPCFace);
    }

    /**
     * Removes a face by the its identifier.
     * @param id - The identifier of the face.
     * @async
     */ 
    public async RemoveFace(faceId: number): Promise<void> {
        await this.resources.rpcClient.invoke("faceManagement.RemoveFace", [ faceId ]);
    }

    /**
     * Updates a face. 
     * @param face - Face with properties to be updated.
     * @param scanForFace - Indicates whether the application should extract a face from the updated image. 
     * @param imageFromCamera - Indicates whether the application should update the face object with a face from the capture source.
     * @async
     */
    public async UpdateFace(face: Face, scanForFace: boolean = false, imageFromCamera: boolean = false): Promise<Face> {
        const rpcFace = await this.resources.rpcClient.invoke("faceManagement.UpdateFace", [ face, scanForFace, imageFromCamera ]);
        return RPCModels.FromRPCFace(rpcFace);
    }
}