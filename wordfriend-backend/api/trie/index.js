const router = require("express").Router();
const controller = require("./controller");
const checkToken = require("../auth/controller").checkToken;

router.put("/insert", checkToken ,controller.insert);
router.head("/search/:word", checkToken ,controller.search);
router.get("/details/:word", checkToken ,controller.details);
router.delete("/remove/:word", checkToken ,controller.remove);
router.get("/getAllWords", checkToken, controller.getAllWords);
router.get("/getStartsWith/:char", checkToken, controller.getStartsWith);
router.post("/multiDetails", checkToken, controller.multiDetails);
router.post("/update", checkToken, controller.update);

module.exports = router;