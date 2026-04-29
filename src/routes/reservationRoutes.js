const express = require('express');
const router = express.Router();
const ReservationController = require("../controllers/reservationController");
const validate = require("../middlewares/validateMiddlewares");
const { reservationSchema, reservationUpdateSchema } = require("../schemas/reservationSchema");
const { authenticate, restrictTo } = require("../middlewares/authMiddleawares");

router.use(authenticate);

router.post("/", validate(reservationSchema), ReservationController.createReservation);
router.get("/", ReservationController.getAllReservations);
router.get("/:id", ReservationController.getReservationById);
router.put("/:id", validate(reservationUpdateSchema), ReservationController.updateReservation);
router.patch("/cancel/:id", restrictTo("CLIENT", "BARBER", "ADMIN") ,ReservationController.cancelReservation);
router.patch("/complete/:id", restrictTo("BARBER", "ADMIN"), ReservationController.completeReservation);

module.exports = router;
