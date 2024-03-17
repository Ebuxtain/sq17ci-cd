

export const Generateotp = () => {
    const otp = Math.floor(1000+ Math.random()* 9000);
    let expiry = new Date();

    expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

    return {otp, expiry}
}

export const onRequestOTP = async (otp: number, toPhoneNumber: string) => {
    const client = require("twilio")(process.env.accountSid, process.env.authToken);

    const response = await client.messages.create({
        body: `Your otp is ${otp} kindly verify your account`,
        to: toPhoneNumber,
        from: process.env.fromAdminPhone
    });

    return response;
};
