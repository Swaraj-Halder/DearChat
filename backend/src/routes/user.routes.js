import { Router } from "express";

import {
  getOtpForSignup,
  signup,
  getOtpForLogin,
  login,
  sendConnectionRequest,
  acceptConnectionRequest,
  getConnections,
  search,
  // socket,
} from "../controllers/user.controllers.js";

const userRouter = Router();

const socketRouter =  Router()

userRouter.post("/get-otp-for-signup", getOtpForSignup);

userRouter.post("/signup", signup);

userRouter.post("/get-otp-for-login", getOtpForLogin);

userRouter.post("/login", login);

userRouter.patch("/send-connection-request", sendConnectionRequest);

userRouter.patch("/accept-connection-request", acceptConnectionRequest);

userRouter.get("/connections", getConnections);

userRouter.get("/search", search);


// socketRouter.get("", socket);

export { userRouter, socketRouter };
