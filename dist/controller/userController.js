"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyUser = exports.Login = exports.Register = void 0;
const utils_1 = require("../utils/utils");
const user_1 = require("../model/user");
const uuid_1 = require("uuid");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const notification_1 = require("../utils/notification");
const jwtsecret = process.env.JWT_SECRET_KEY;
const Register = async (req, res) => {
    try {
        const { email, firstName, password, phone, confirm_password } = req.body;
        const iduuid = (0, uuid_1.v4)();
        // Define options for schema validation if needed
        const options = {};
        // validate with Joi or zod
        const validateResult = utils_1.registerUserSchema.validate(req.body, options);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ Error: validateResult.error.details[0].message });
        }
        // Generate salt for password hash
        const passwordHash = await bcryptjs_1.default.hash(password, await bcryptjs_1.default.genSalt());
        // Check if user exists
        const user = await user_1.UserInstance.findOne({
            where: { email: email },
        });
        // Generate otp
        const { otp, expiry } = (0, notification_1.Generateotp)();
        if (!user) {
            const newUser = await user_1.UserInstance.create({
                id: iduuid,
                email,
                firstName,
                password: passwordHash,
                phone,
                otp,
                otp_expiry: expiry,
                verified: false,
                role: "user",
            });
            // Generate token for the user
            const token = jsonwebtoken_1.default.sign({ id: newUser.id }, jwtsecret, {
                expiresIn: "3h",
            });
            // Send the token along with the response
            return res
                .status(201)
                .json({ msg: "Registration successful", newUser, token });
        }
        else {
            return res.status(400).json({ msg: "Email already exists" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
};
exports.Register = Register;
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate with Joi or zod
        const validateResult = utils_1.loginUserSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ Error: validateResult.error.details[0].message });
        }
        // Check the user infor before generating token
        const User = (await user_1.UserInstance.findOne({
            where: { email: email },
        }));
        const { id } = User;
        // Generate token for the user
        const token = jsonwebtoken_1.default.sign({ id }, jwtsecret, { expiresIn: "3h" });
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 1000,
        });
        // Compare the password you are using to login too the one in db
        const validUser = await bcryptjs_1.default.compare(password, User.password);
        if (validUser) {
            return res.status(201).json({
                msg: "User login successfully",
                User,
                token,
            });
        }
        return res.status(400).json({
            error: "Invalid email/password",
        });
    }
    catch (err) {
        console.log(err);
    }
};
exports.Login = Login;
const verifyUser = async (req, res) => {
    try {
        const { signature } = req.params;
        const decode = jsonwebtoken_1.default.verify(signature, jwtsecret);
        // check if the user is a registered user
        const user = await user_1.UserInstance.findByPk(decode.id);
        if (user) {
            const { otp } = req.body;
            if (user.otp === parseInt(otp) && user.otp_expiry >= new Date()) {
                await user.update({ verified: true });
            }
            return res.status(200).json({
                msg: "You have successfully verified your account",
                signature,
                updatedUser: user, // Assign the updated user to updatedUser
            });
        }
    }
    catch (err) {
        console.log(err);
    }
    // // check if the user is registered
    // const user = await User.findOne({email})
};
exports.verifyUser = verifyUser;
