const express = require("express");
const router = express.Router();
const purchaseController = require("../controllers/purchaseController");

router.post("/", purchaseController.recordPurchase);
router.get("/history", purchaseController.getPurchaseHistory);

module.exports = router;
