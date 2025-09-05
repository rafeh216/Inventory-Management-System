const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  originalQuantity: {
    type: Number,
    required: true,
  },
  originalTotalCost: {
    type: Number,
    required: true,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
});

const saleSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  pieces: {
    type: Number,
    required: true,
  },
  priceAtSale: {
    type: Number,
    required: true,
  },
});

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    buyingPrice: {
      type: Number,
      required: false, // Might not be needed if using purchaseHistory
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    quantityBought: {
      type: Number,
      default: 0,
    },
    quantityLeft: {
      type: Number,
      default: 0,
    },
    totalSold: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    purchaseHistory: [purchaseSchema],
    salesHistory: [saleSchema],

    lastResetDate: {
      type: Date,
      default: null, 
    },
  },
  { timestamps: true }
);

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
module.exports = Item;
