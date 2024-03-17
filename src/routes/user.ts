import express from 'express';
import {Register, verifyUser} from "../controller/userController";
import{Login} from "../controller/userController"


const router = express.Router();

/* Gets users listing. */

router.post("/register", Register);
router.post("/login", Login);
router.post("/verify/:signature", verifyUser);

export default router;