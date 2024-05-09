const {addMessage,getMessage} =require("../controller/messageController")
const express = require("express")

const router = express.Router();

router.post("/addmsg", addMessage);
router.post("/getmsg", getMessage);

module.exports = router;