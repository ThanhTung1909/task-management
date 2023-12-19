const express = require("express");
const router = express.Router();
const validate = require("../validates/user.validate");
const authMiddleware = require("../middlewares/auth.middleware");

const controller = require("../controllers/user.controller");

router.post("/register", validate.register, controller.register);

router.post("/login", validate.login, controller.login);

router.post("/password/forgot", controller.forgotPassword);

router.post("/password/otp", controller.otpPassword);

router.post("/password/reset", controller.resetPassword);

router.get("/detail", authMiddleware.requireAuth, controller.detail);

router.get("/list", authMiddleware.requireAuth, controller.list);

module.exports = router;