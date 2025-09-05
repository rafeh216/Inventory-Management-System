import React, { useEffect, useState } from "react";
import API from "../api";

const SalesEntry = () => {
  const [items, setItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [quantitySold, setQuantitySold] = useState("");
  const [dateSold, setDateSold] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("/items")
      .then((res) => setItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedItemId || !quantitySold) {
      setMessage("❌ Please fill in all required fields.");
      return;
    }

    try {
      await API.post("/sales/record", {
        itemId: selectedItemId,
        quantitySold: Number(quantitySold),
        priceAtSale: selectedItem?.sellingPrice,
        dateSold: dateSold || new Date(),
      });

      setMessage("✅ Sale recorded successfully!");
      setSelectedItemId("");
      setQuantitySold("");
      setDateSold("");
      setSelectedItem(null);
    } catch (err) {
      setMessage("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Record a New Sale</h1>

      <div className="bg-gray-50 rounded-xl shadow-md p-6 max-w-lg mx-auto">
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Select Item</label>
          <select
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={selectedItemId}
            onChange={(e) => {
              const id = e.target.value;
              setSelectedItemId(id);
              const item = items.find((i) => i._id === id);
              setSelectedItem(item);
            }}
          >
            <option value="">-- Select Item --</option>
            {items.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Quantity Sold</label>
          <input
            type="number"
            value={quantitySold}
            onChange={(e) => setQuantitySold(e.target.value)}
            placeholder={
              selectedItem ? `Available: ${selectedItem.quantityLeft}` : ""
            }
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">Date of Sale (optional)</label>
          <input
            type="date"
            value={dateSold}
            onChange={(e) => setDateSold(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded transition shadow-md"
        >
          Record Sale
        </button>

        {message && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default SalesEntry;
