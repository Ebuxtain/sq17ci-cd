import { Request, Response } from "express";
import { registerUserSchema, options, loginUserSchema } from "../utils/utils";
import { UserInstance } from "../model/user";
import { v4 as uuid4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Generateotp, onRequestOTP } from "../utils/notification";

const jwtsecret = process.env.JWT_SECRET_KEY as string;

export const Register = async (req: Request, res: Response) => {
  try {
    const { email, firstName, password, phone, confirm_password } = req.body;
    const iduuid = uuid4();

    // Define options for schema validation if needed
    const options = {};

    // validate with Joi or zod
    const validateResult = registerUserSchema.validate(req.body, options);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    // Generate salt for password hash
    const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt());

    // Check if user exists
    const user = await UserInstance.findOne({
      where: { email: email },
    });

    // Generate otp
    const { otp, expiry } = Generateotp();

    if (!user) {
      const newUser = await UserInstance.create({
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
      const token = jwt.sign({ id: newUser.id }, jwtsecret, {
        expiresIn: "3h",
      });

      // Send the token along with the response
      return res
        .status(201)
        .json({ msg: "Registration successful", newUser, token });
    } else {
      return res.status(400).json({ msg: "Email already exists" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // validate with Joi or zod

    const validateResult = loginUserSchema.validate(req.body, options);

    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    // Check the user infor before generating token

    const User = (await UserInstance.findOne({
      where: { email: email },
    })) as unknown as { [key: string]: string };

    const { id } = User;
    // Generate token for the user

    const token = jwt.sign({ id }, jwtsecret, { expiresIn: "3h" });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 1000,
    });

    // Compare the password you are using to login too the one in db
    const validUser = await bcrypt.compare(password, User.password);

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
  } catch (err) {
    console.log(err);
  }
};

export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { signature } = req.params;
    const decode = jwt.verify(signature, jwtsecret) as JwtPayload;

    // check if the user is a registered user
    const user = await UserInstance.findByPk(decode.id);


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
  } catch (err) {
    console.log(err);
  }

  // // check if the user is registered
  // const user = await User.findOne({email})
};
