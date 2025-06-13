import express from "express";
import {
  login,
  register,
  googleCallback,
  googleFailure,
} from "../controllers/authControllers.js";
const router = express.Router();
import passport from "passport";

// route de connexion et création de compte local strategie
router.post("/login", login);
router.post("/register", register);
//

// route O2auth Google
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/auth/failure",
  }),
  googleCallback
);
router.get("/failure", googleFailure);
//

export default router;
