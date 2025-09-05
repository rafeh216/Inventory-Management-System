const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Inventory API running...");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
.catch((err) => console.log(err));

const itemRoutes = require("./routes/itemRoutes");
const salesRoutes = require("./routes/salesRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
app.use("/api/items", itemRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/purchases", purchaseRoutes);

