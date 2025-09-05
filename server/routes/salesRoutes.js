const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

router.get("/history", salesController.getSalesHistory);
router.post("/record", salesController.recordSale);
router.delete("/:id", salesController.deleteSale);
router.get("/total-cash", salesController.getTotalCashInHand);
router.put("/reset-stats", salesController.resetSalesStats)
router.get("/stats", salesController.getCurrentStats);
router.get("/stats-after-reset", salesController.getStatsAfterReset);

module.exports = router;
