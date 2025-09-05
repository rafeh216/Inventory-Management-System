const SalesHistory = require("../models/SalesHistory");
const Item = require("../models/ItemModel");

exports.recordSale = async (req, res) => {
  try {
    const { itemId, quantitySold, dateSold } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    if (item.quantityLeft < quantitySold) {
      return res.status(400).json({ error: "Insufficient stock" });
    }

    let remainingToSell = quantitySold;
    let profit = 0;

    for (const batch of item.purchaseHistory) {
      if (remainingToSell <= 0) break;

      const sellQty = Math.min(batch.quantity, remainingToSell);
      const costPerUnit = batch.originalTotalCost / batch.originalQuantity;

      profit += (item.sellingPrice - costPerUnit) * sellQty;
      batch.quantity -= sellQty;
      batch.totalCost -= costPerUnit * sellQty;

      remainingToSell -= sellQty;
    }

    item.quantityLeft -= quantitySold;
    item.totalSold += quantitySold;
    item.profit += profit;
    item.purchaseHistory = item.purchaseHistory.filter((b) => b.quantity > 0);

    await item.save();

    const sale = new SalesHistory({
      itemId,
      quantitySold,
      priceAtSale: item.sellingPrice,
      dateSold: dateSold || new Date(),
    });

    await sale.save();
    res.status(201).json(sale);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SalesHistory.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: "Sale not found" });
    res.status(200).json({ message: "Sale deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSalesHistory = async (req, res) => {
  try {
    const history = await SalesHistory.find()
      .populate("itemId", "name")
      .sort({ dateSold: -1 });

    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTotalCashInHand = async (req, res) => {
  try {
    const sales = await SalesHistory.find();
    let totalCash = 0;

    for (const sale of sales) {
      const item = await Item.findById(sale.itemId);
      if (
        item &&
        (!item.lastResetDate || new Date(sale.dateSold) > new Date(item.lastResetDate))
      ) {
        totalCash += sale.priceAtSale * sale.quantitySold;
      }
    }

    res.status(200).json({ totalCash });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getStatsAfterReset = async (req, res) => {
  try {
    const items = await Item.find();
    const sales = await SalesHistory.find();

    let totalSales = 0;
    let totalProfit = 0;

    for (const sale of sales) {
      const item = items.find((i) => i._id.toString() === sale.itemId.toString());

      if (
        item &&
        (!item.lastResetDate || new Date(sale.dateSold) > new Date(item.lastResetDate))
      ) {
        totalSales += sale.quantitySold;

        const avgCost =
          item.purchaseHistory?.length > 0
            ? item.purchaseHistory.reduce((sum, batch) => {
                return sum + batch.originalTotalCost / batch.originalQuantity;
              }, 0) / item.purchaseHistory.length
            : 0;

        totalProfit += (sale.priceAtSale - avgCost) * sale.quantitySold;
      }
    }

    res.status(200).json({ totalSales, totalProfit });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCurrentStats = async (req, res) => {
  try {
    const items = await Item.find();
    const sales = await SalesHistory.find();

    const stats = items.map((item) => {
      const resetDate = item.lastResetDate ? new Date(item.lastResetDate) : new Date(0);

      const itemSales = sales.filter(
        (sale) =>
          sale.itemId.toString() === item._id.toString() &&
          new Date(sale.dateSold) > resetDate
      );

      let totalSold = 0;
      let profit = 0;

      for (const sale of itemSales) {
        const costBatches = item.purchaseHistory;
        let remainingQty = sale.quantitySold;

        for (const batch of costBatches) {
          if (remainingQty <= 0) break;

          const costPerUnit = batch.originalTotalCost / batch.originalQuantity;
          const sellQty = Math.min(batch.quantity, remainingQty);

          profit += (sale.priceAtSale - costPerUnit) * sellQty;
          remainingQty -= sellQty;
        }

        totalSold += sale.quantitySold;
      }

      return {
        itemId: item._id,
        name: item.name,
        totalSold,
        profit,
      };
    });

    res.status(200).json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetSalesStats = async (req, res) => {
  try {
    const now = new Date();
    const items = await Item.find();

    for (const item of items) {
      item.totalSold = 0;
      item.profit = 0;
      item.lastResetDate = now;
      await item.save();
    }

    res.status(200).json({ message: "Sales stats reset successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
