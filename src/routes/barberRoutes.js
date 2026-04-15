const express = require("express");
const router = express.Router();
const BarberController = require("../controllers/barberController");
const validate = require("../middlewares/validateMiddlewares");
const { barberCreateSchema } = require("../validators/barberValidators");
const { authenticate, restrictTo} = require("../middlewares/authMiddleawares");

router.use(authenticate);
router.use(restrictTo("ADMIN"));

router.post("/", validate(barberCreateSchema), BarberController.createBarber);
router.get("/", BarberController.getAllbarbers);
router.get("/:id", BarberController.getBarberById);
router.put("/:id", BarberController.updateBarber);
router.delete("/:id", BarberController.deactivateBarber);


module.exports = router;