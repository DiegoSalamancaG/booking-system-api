const express = require("express")
const router = express.Router();
const ServiceController = require("../controllers/serviceController");
const validate = require("../middlewares/validateMiddlewares");
const { serviceCreateSchema } = require("../schemas/serviceSchema");
const {authenticate, restrictTo } = require("../middlewares/authMiddleawares");

router.use(authenticate);
router.use(restrictTo("ADMIN"));

router.post("/",validate(serviceCreateSchema), ServiceController.createService);
router.get("/", ServiceController.getAllServices);
router.get("/:id",ServiceController.getServiceById);
router.put("/:id", ServiceController.updateService);
router.delete("/:id", ServiceController.deactivateService);

module.exports = router;