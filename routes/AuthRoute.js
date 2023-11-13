const { getCurrentUserController } = require("../controllers/AuthController");
const router = require("express").Router();
const AuthController = require('../controllers/AuthController');

router.post("/reg", AuthController.registerUser);
router.post("/login", AuthController.loginUser);

module.exports = router;