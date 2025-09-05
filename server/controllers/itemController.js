const Item = require("../models/ItemModel");
const SalesHistory = require("../models/SalesHistory");
const asyncHandler = require("express-async-handler");

const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    const updatedItems = items.map((item) => ({
      ...item.toObject(),
      quantitySold: item.totalSold,
      profit: parseFloat((item.profit || 0).toFixed(2)),
    }));
    res.json(updatedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createItem = asyncHandler(async (req, res) => {
  const { name, buyingPrice, sellingPrice, quantityBought } = req.body;
  const parsedBuyingPrice = parseFloat(buyingPrice);
  const parsedQuantity = parseInt(quantityBought);

  if (!name || isNaN(parsedBuyingPrice) || isNaN(parsedQuantity)) {
    res.status(400);
    throw new Error("Invalid input");
  }

  const totalCost = parsedBuyingPrice;

  const item = await Item.create({
    name,
    sellingPrice: parseFloat(sellingPrice),
    quantityBought: parsedQuantity,
    quantityLeft: parsedQuantity,
    totalCost,
    profit: 0,
    purchaseHistory: [
      {
        quantity: parsedQuantity,
        totalCost,
        originalQuantity: parsedQuantity,
        originalTotalCost: totalCost,
        purchaseDate: new Date()
      },
    ],
  });

  res.status(201).json(item);
});

const restockItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity, buyingPrice, sellingPrice } = req.body;

  const parsedQuantity = parseInt(quantity);
  const parsedBuyingPrice = parseFloat(buyingPrice);

  if (isNaN(parsedQuantity) || parsedQuantity <= 0 || isNaN(parsedBuyingPrice) || parsedBuyingPrice <= 0) {
    res.status(400);
    throw new Error("Invalid input");
  }

  const item = await Item.findById(id);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  const totalCost = parsedBuyingPrice;

  item.quantityBought += parsedQuantity;
  item.quantityLeft += parsedQuantity;
  item.totalCost += totalCost;

  item.purchaseHistory.push({
    quantity: parsedQuantity,
    totalCost,
    originalQuantity: parsedQuantity,
    originalTotalCost: totalCost,
    purchaseDate: new Date()
  });

  if (sellingPrice && !isNaN(parseFloat(sellingPrice))) {
    item.sellingPrice = parseFloat(sellingPrice);
  }

  await item.save();
  res.status(200).json(item);
});

const updateStockAndPrice = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantitySold, sellingPrice } = req.body;

  const parsedQuantity = parseInt(quantitySold);
  const parsedSellingPrice = parseFloat(sellingPrice);

  if (!parsedQuantity || !parsedSellingPrice) {
    res.status(400);
    throw new Error("Invalid quantity or price");
  }

  const item = await Item.findById(id);
  if (!item) {
    res.status(404);
    throw new Error("Item not found");
  }

  if (parsedQuantity > item.quantityLeft) {
    res.status(400);
    throw new Error("Not enough quantity in stock");
  }

  let remainingToSell = parsedQuantity;
  let profit = 0;

  for (const batch of item.purchaseHistory) {
    if (remainingToSell <= 0) break;

    const sellQty = Math.min(batch.quantity, remainingToSell);
    const costPerUnit = batch.originalTotalCost / batch.originalQuantity;

    profit += (parsedSellingPrice - costPerUnit) * sellQty;
    batch.quantity -= sellQty;
    batch.totalCost -= costPerUnit * sellQty;

    remainingToSell -= sellQty;
  }

  item.quantityLeft -= parsedQuantity;
  item.sellingPrice = parsedSellingPrice;
  item.profit += profit;
  item.purchaseHistory = item.purchaseHistory.filter((b) => b.quantity > 0);

  await item.save();
  res.status(200).json(item);
});

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.status(200).json({ message: "Item deleted", id: item._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedItem = await Item.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const resetItemStats = async (req, res) => {
  try {
    const items = await Item.find();
    for (const item of items) {
      item.profit = 0;
      item.totalSold = 0;
      await item.save();
    }
    res.status(200).json({ message: "Item stats reset successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllItems,
  createItem,
  restockItem,
  updateStockAndPrice,
  deleteItem,
  updateItem,
  resetItemStats,
};
