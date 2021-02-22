const router = require("express").Router();
const controller = require("./controller");

router.get("/completeOAuthSignIn", controller.completeOAuthSignIn);
router.get("/isAuthenticated", controller.checkToken, controller.isAuthenticated);
router.get("/logout", controller.logout);

module.exports = router;