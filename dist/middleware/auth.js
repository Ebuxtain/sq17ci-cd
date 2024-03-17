"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../model/user");
const jwtsecret = process.env.JWT_SECRET_KEY;
async function auth(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ error: 'Kindly sign up in as a user' });
    }
    const token = authorization.slice(7, authorization.length);
    let verified = jsonwebtoken_1.default.verify(token, jwtsecret);
    if (!verified) {
        return res.status(401).json({ error: 'invalid token, you canot access this route' });
    }
    const { id } = verified;
    // Check user in database
    const user = await user_1.UserInstance.findOne({ where: { id } });
    if (!user) {
        return res.status(401).json({ error: 'Kindly sign up in as a user' });
    }
    req.user = verified;
    next();
}
exports.auth = auth;
