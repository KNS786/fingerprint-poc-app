"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const faceapi = __importStar(require("face-api.js"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function loadModels() {
    return __awaiter(this, void 0, void 0, function* () {
        const modelPath = path.resolve(__dirname, "models");
        console.log("modalPath ::", modelPath);
        yield faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);
        yield faceapi.nets.faceLandmark68Net.loadFromDisk(modelPath);
        yield faceapi.nets.faceRecognitionNet.loadFromDisk(modelPath);
    });
}
function compareFaces() {
    return __awaiter(this, void 0, void 0, function* () {
        yield loadModels();
        const image1 = yield faceapi.bufferToImage(Buffer.from(fs.readFileSync("../../../images/register.jpg")));
        const image2 = yield faceapi.bufferToImage(Buffer.from(fs.readFileSync("../../../images/login.jpg")));
        // const image1 = await faceapi.bufferToImage(
        // 	fs.readFileSync("/home/navani/Desktop/images/register.jpg")
        // )
        // const image2 = await faceapi.bufferToImage(
        // 	fs.readFileSync("/home/navani/Desktop/images/login.jpg")
        // )
        const face1 = yield faceapi
            .detectSingleFace(image1)
            .withFaceLandmarks()
            .withFaceDescriptor();
        console.log("face1 :::", face1);
        const face2 = yield faceapi
            .detectSingleFace(image2)
            .withFaceLandmarks()
            .withFaceDescriptor();
        console.log("face2 ::", face2);
        if (face1 && face2) {
            const distance = faceapi.euclideanDistance(face1.descriptor, face2.descriptor);
            console.log("Face distance:", distance);
        }
        else {
            console.log("No faces detected in one or both images.");
        }
    });
}
module.exports = compareFaces;
