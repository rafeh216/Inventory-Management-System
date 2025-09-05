import React, { useState, useEffect } from "react";
import API, { deleteItem } from "../api";
import ItemFormModal from "../components/ItemFormModal";
import ProfitPieChart from "../components/ProfitPieChart";

const Dashboard = ({ searchTerm }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [globalPrice, setGlobalPrice] = useState("");
  const [totalCash, setTotalCash] = useState(0);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/items");
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  };

  const fetchTotalCash = async () => {
    try {
      const res = await API.get("/sales/total-cash");
      setTotalCash(res.data.totalCash);
    } catch {}
  };

  const fetchSalesStats = async () => {
    try {
      const res = await API.get("/sales/stats-after-reset");
      setTotalSales(res.data.totalSales);
      setTotalProfit(res.data.totalProfit);
    } catch {}
  };

  useEffect(() => {
    fetchItems();
    fetchTotalCash();
    fetchSalesStats();
  }, []);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSetSellingPrice = async () => {
    if (!globalPrice || Number(globalPrice) <= 0) return;
    try {
      await API.put("/items/set-selling-price", {
        newPrice: Number(globalPrice),
      });
      setGlobalPrice("");
      fetchItems();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this item?")) {
      try {
        await deleteItem(id);
        fetchItems();
      } catch {}
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editItem) {
        await API.put(`/items/${editItem._id}`, formData);
      } else {
        await API.post("/items", formData);
      }
      fetchItems();
      setShowForm(false);
    } catch {}
  };

  const handleResetStats = async () => {
    if (window.confirm("Reset all sales and profit stats?")) {
      try {
        await API.put("/sales/reset-stats");
        fetchItems();
        fetchTotalCash();
        fetchSalesStats();
      } catch {}
    }
  };

  return (
    <div className="relative bg-white min-h-screen p-6 text-gray-800">
      {showForm ? (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center">
          <ItemFormModal
            isOpen={showForm}
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
            initialData={editItem}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
            <div className="flex gap-2 flex-wrap">
              <input
                type="number"
                placeholder="Set new selling price"
                value={globalPrice}
                onChange={(e) => setGlobalPrice(e.target.value)}
                className="p-2 rounded border border-gray-300 text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={handleSetSellingPrice}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-semibold shadow-md transition"
              >
                Set Selling Price
              </button>
              <button
                onClick={handleResetStats}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold shadow-md transition"
              >
                Reset Stats
              </button>
            </div>
            <button
              onClick={() => {
                setEditItem(null);
                setShowForm(true);
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold shadow-md transition"
            >
              + New Item
            </button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-center text-gray-500">No items found.</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full text-sm text-left text-gray-700 bg-white border border-gray-200">
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Buying Price</th>
                    <th className="px-4 py-3">Selling Price</th>
                    <th className="px-4 py-3">Bought</th>
                    <th className="px-4 py-3">Left</th>
                    <th className="px-4 py-3">Profit</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="border-t border-gray-200">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">Rs. {item.totalCost}</td>
                      <td className="px-4 py-2">Rs. {item.sellingPrice}</td>
                      <td className="px-4 py-2">{item.quantityBought}</td>
                      <td className="px-4 py-2">{item.quantityLeft}</td>
                      <td className="px-4 py-2">
                        Rs. {(item.profit ?? 0).toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-10 bg-gray-50 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Profit Breakdown</h2>
            <ProfitPieChart data={items} cashInHand={Number(totalCash.toFixed(2))} />
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
