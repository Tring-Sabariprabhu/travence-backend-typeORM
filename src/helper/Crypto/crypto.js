"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPassword = exports.encryptPassword = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const encryptPassword = (password) => {
    if (process.env.CRYPTO_KEY)
        return crypto_js_1.default.AES.encrypt(password, process.env.CRYPTO_KEY).toString();
};
exports.encryptPassword = encryptPassword;
const decryptPassword = (encryptedPassword) => {
    if (process.env.CRYPTO_KEY) {
        const bytes = crypto_js_1.default.AES.decrypt(encryptedPassword, process.env.CRYPTO_KEY);
        return bytes.toString(crypto_js_1.default.enc.Utf8);
    }
};
exports.decryptPassword = decryptPassword;
