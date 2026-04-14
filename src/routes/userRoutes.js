const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const validate = require("../middlewares/validateMiddlewares");
const {userSchema}= require("../validators/userValidators");
const { authenticate, restrictTo } = require("../middlewares/authMiddleawares");

router.use(authenticate);
router.use(restrictTo("ADMIN"));

router.get("/", userController.getAllUsers);
router.get("/actives", userController.getAllActiveUsers);
router.post("/", validate(userSchema), userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deactivateUser);

module.exports = router;