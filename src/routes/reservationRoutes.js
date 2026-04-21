const express = require('express');
const router = express.Router();
const ReservationController = require("../controllers/reservationController");
const validate = require("../middlewares/validateMiddlewares");
const { reservationSchema, reservationUpdateSchema } = require("../schemas/reservationSchema");
const { authenticate, restrictTo } = require("../middlewares/authMiddleawares");

router.use(authenticate);
router.use(restrictTo("CLIENT", "ADMIN"));

router.post("/", validate(reservationSchema), ReservationController.createReservation);
router.get("/", ReservationController.getAllReservations);
router.get("/:id", ReservationController.getReservationById);
router.put("/:id", validate(reservationUpdateSchema), ReservationController.updateReservation);

module.exports = router;
