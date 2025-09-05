const PurchaseHistory = require("../models/PurchaseHistory");
const Item = require("../models/ItemModel");

exports.recordPurchase = async (req, res) => {
  try {
    const { itemId, quantityPurchased, totalCost, datePurchased } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.quantityBought += quantityPurchased;
    item.totalCost += totalCost;
    item.quantityLeft += quantityPurchased;
    await item.save();

    const purchase = new PurchaseHistory({
      itemId,
      quantityPurchased,
      totalCost,
      datePurchased: datePurchased || new Date(),
    });

    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const history = await PurchaseHistory.find()
      .populate("itemId", "name")
      .sort({ datePurchased: -1 });
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
