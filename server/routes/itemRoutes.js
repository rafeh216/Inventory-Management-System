const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const Item = require("../models/ItemModel");

router.get("/", itemController.getAllItems);
router.post("/", itemController.createItem);

router.get("/history", async (req, res) => {
  try {
    const items = await Item.find();
    const salesHistory = [];

    items.forEach((item) => {
      item.salesHistory?.forEach((entry) => {
        salesHistory.push({
          itemName: item.name,
          pieces: entry.pieces,
          date: entry.date,
        });
      });
    });

    res.json(salesHistory);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/set-selling-price", async (req, res) => {
  try {
    const { newPrice } = req.body;
    if (!newPrice || newPrice <= 0) return res.status(400).json({ message: "Invalid price." });
    await Item.updateMany({}, { $set: { sellingPrice: newPrice } });
    res.json({ message: "Selling price updated for all items." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

router.put("/update-stock-price/:id", itemController.updateStockAndPrice);
router.post("/restock/:id", itemController.restockItem);
router.put("/:id", itemController.updateItem);

router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
