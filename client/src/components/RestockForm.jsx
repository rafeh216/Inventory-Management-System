import React, { useState, useEffect } from "react";
import API from "../api";

const RestockForm = () => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [totalBuyingPrice, setTotalBuyingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/items")
      .then((res) => setItems(res.data))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || !totalBuyingPrice || !quantity) {
      setMessage("❌ All required fields must be filled");
      return;
    }

    try {
      await API.post(`/items/restock/${selectedItem}`, {
        quantity: Number(quantity),
        buyingPrice: Number(totalBuyingPrice),
        sellingPrice: sellingPrice ? Number(sellingPrice) : undefined,
      });

      setMessage("✅ Restocked successfully");
      setSelectedItem("");
      setTotalBuyingPrice("");
      setQuantity("");
      setSellingPrice("");

      const itemsResponse = await API.get("/items");
      setItems(itemsResponse.data);
    } catch (err) {
      setMessage("❌ Failed to restock item");
    }
  };

  const pricePerUnit = totalBuyingPrice && quantity ? (Number(totalBuyingPrice) / Number(quantity)).toFixed(2) : 0;

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Restock Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Item</option>
          {items.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} (Current stock: {item.quantityLeft})
            </option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="Total Buying Price (bulk) *"
          value={totalBuyingPrice}
          onChange={(e) => setTotalBuyingPrice(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="number"
          placeholder="Quantity *"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        {totalBuyingPrice && quantity && (
          <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            Price per unit: {pricePerUnit}Rs
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 rounded hover:bg-blue-700 transition"
        >
          Restock
        </button>

        {message && (
          <p
            className={`text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RestockForm;
