import express from 'express'
import { login, register } from '../controllers/authControllers.js'
const router = express.Router()
import passport from 'passport';


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
    (req, res) => {
      const { token } = req.user;
      res.json({ token });
    }
  );
  
  router.get("/failure", (req, res) => {
    res.status(401).json({ message: "Google Authentication Failed" });
  });
  

  
router.post('/login', login)
router.post('/register', register)


export default router











