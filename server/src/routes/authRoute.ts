import { Router } from "express";
import {
  allowLoggedInUser,
  login,
  logout,
  signup,
} from "../controllers/authController";
import {
  authValidationHandler,
  loginValidator,
  signupValidator,
} from "../middleware/authValidator";
import checkLogin from "../middleware/checkLogin";
import profileImageUpload from "../middleware/profileImageUpload";

const router: Router = Router();

router.post(
  "/signup",
  profileImageUpload,
  signupValidator,
  authValidationHandler,
  signup
);

router.post("/login", loginValidator, authValidationHandler, login);

router.get("/logout", checkLogin, logout);

router.get("/checklogin", checkLogin, allowLoggedInUser);

export default router;
