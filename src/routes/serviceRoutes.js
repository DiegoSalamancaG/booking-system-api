const express = require("express")
const router = express.Router();
const ServiceController = require("../controllers/serviceController");
const validate = require("../middlewares/validateMiddlewares");
const { serviceSchema } = require("../validators/serviceSchema");
const {authenticate, restrictTo } = require("../middlewares/authMiddleawares");

router.use(authenticate);
router.use(restrictTo("ADMIN"));

router.post("/",validate(serviceSchema), ServiceController.createService);
router.get("/", ServiceController.getAllServices);
router.get("/actives",ServiceController.getAllActiveServices);
router.get("/:id",ServiceController.getServiceById);
router.put("/:id", ServiceController.updateService);
router.delete("/:id", ServiceController.deactivateService);

module.exports = router;