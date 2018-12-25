
const chance = require('chance')();
const { assert } = require("chai");
const { setupServer, setupAppResources, fake } = require("./common");
const { FaceManagementService } = require("../lib");

describe("FaceManagementService", function () {
    describe("#AddFace", function () {
        it("Should return a Face object with the same properties sent", async function () {
            const { server, port } = await setupServer();
            const faceMgmt = new FaceManagementService(setupAppResources(port));

            const face = fake.face()

            server.methods["faceManagement.AddFace"] = async (image, name, autostart) => {
                assert.deepEqual(image, face.image);
                assert.equal(name, face.name);
                assert.equal(autostart, face.autostart);
                return face;
            };

            const rpcFace = await faceMgmt.AddFace(face.image, face.name, face.autostart);

            assert.deepEqual(rpcFace, face);
        });
    });

    describe("#AddFaceFromCamera", function () {
        it("Should return a Face object with the same properties sent", async function () {
            const { server, port } = await setupServer();
            const faceMgmt = new FaceManagementService(setupAppResources(port));

            const face = fake.face();

            server.methods["faceManagement.AddFaceFromCamera"] = async (name, autostart) => {
                assert.equal(name, face.name);
                assert.equal(autostart, face.autostart);
                return face;
            };

            const rpcFace = await faceMgmt.AddFaceFromCamera(face.name, face.autostart);

            assert.deepEqual(rpcFace, face);
        });
    });

    describe("#GetFace", function () {
        it("Should return the face with the matching ID", async function () {
            const { server, port } = await setupServer();
            const faceMgmt = new FaceManagementService(setupAppResources(port));

            const face = fake.face();
            const faces = new Map();
            faces.set(face.id, face);

            server.methods["faceManagement.GetFace"] = async (faceId) => {
                assert.isTrue(faces.has(faceId));

                return faces.get(faceId);
            };

            const rpcFace = await faceMgmt.GetFace(face.id);
            
            assert.deepEqual(rpcFace, face);
        });
    });

    describe("#GetFaces", function () {
        it("Should retireve all faces from the server", async function () {
            const { server, port } = await setupServer();
            const resources = setupAppResources(port);
            const faceMgmt = new FaceManagementService(resources);

            const faces = fake.faces();
            
            server.methods['faceManagement.GetFaces'] = async () => faces;

            const returnFaces = await faceMgmt.GetFaces();

            assert.equal(returnFaces.length, faces.length, "Number of returned commands did not equal the number originally created");

            let i = 0;
            while (returnFaces.length) {
                const returnedFace = returnFaces.shift();

                assert.deepEqual(returnedFace, faces[i++]);
            }
        });
    });

    describe("#UpdateFace", function () {
        it("Should update a face on the server", async function () {
            const { server, port } = await setupServer();
            const resources = setupAppResources(port);
            const faceMgmt = new FaceManagementService(resources);

            const face = fake.face();
            
            server.methods['faceManagement.UpdateFace'] = async (faceDelta) => {
                faceDelta.name = chance.string();
                return faceDelta;
            };

            const returnFace = await faceMgmt.UpdateFace(face);
            assert.equal(returnFace.id, face.id, "Face returned was not equal to the face sent.");
            assert.notDeepEqual(returnFace, face);
        });
    });
});