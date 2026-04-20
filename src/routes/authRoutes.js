const express = require('express');
const AuthController = require("../controllers/authController");
const { loginSchema, registerSchema } = require("../schemas/authSchema");
const validate = require("../middlewares/validateMiddlewares");

const router = express.Router();

router.post("/login", validate(loginSchema), AuthController.loginController);
router.post("/register", validate(registerSchema), AuthController.registerController);

module.exports = router;