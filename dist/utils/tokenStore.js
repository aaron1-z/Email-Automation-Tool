"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToken = exports.saveToken = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const tokenFilePath = path_1.default.join(__dirname, 'tokens.json');
const saveToken = (service, token) => {
    const tokens = fs_1.default.existsSync(tokenFilePath) ? JSON.parse(fs_1.default.readFileSync(tokenFilePath, 'utf-8')) : {};
    tokens[service] = token;
    fs_1.default.writeFileSync(tokenFilePath, JSON.stringify(tokens));
};
exports.saveToken = saveToken;
const getToken = (service) => {
    if (!fs_1.default.existsSync(tokenFilePath))
        return null;
    const tokens = JSON.parse(fs_1.default.readFileSync(tokenFilePath, 'utf-8'));
    return tokens[service];
};
exports.getToken = getToken;
