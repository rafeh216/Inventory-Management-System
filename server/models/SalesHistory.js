const mongoose = require("mongoose");

const salesHistorySchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantitySold: {
    type: Number,
    required: true,
  },
  priceAtSale: {
    type: Number,
    required: true,
  },
  dateSold: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("SalesHistory", salesHistorySchema);
