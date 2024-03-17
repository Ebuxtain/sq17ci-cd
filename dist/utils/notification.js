"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onRequestOTP = exports.Generateotp = void 0;
const Generateotp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    let expiry = new Date();
    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);
    return { otp, expiry };
};
exports.Generateotp = Generateotp;
const onRequestOTP = async (otp, toPhoneNumber) => {
    const client = require("twilio")(process.env.accountSid, process.env.authToken);
    const response = await client.messages.create({
        body: `Your otp is ${otp} kindly verify your account`,
        to: toPhoneNumber,
        from: process.env.fromAdminPhone
    });
    return response;
};
exports.onRequestOTP = onRequestOTP;
