const mongoose = require("mongoose");

const purchaseHistorySchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantityPurchased: {
    type: Number,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  datePurchased: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("PurchaseHistory", purchaseHistorySchema);
