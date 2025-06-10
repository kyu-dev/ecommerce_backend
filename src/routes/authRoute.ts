import express from 'express'
import { login } from '../controllers/authControllers'
import { register } from '../controllers/authControllers'
const router = express.Router()

router.post('/login', login)
router.post('/register', register)

export default router