import React, { useState, useEffect } from "react";

const ItemFormModal = ({ onSubmit, onClose, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: "",
    buyingPrice: "",
    sellingPrice: 250,
    quantityBought: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        buyingPrice: initialData.buyingPrice || "",
        sellingPrice: initialData.sellingPrice || 250,
        quantityBought: initialData.quantityBought || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "name" ? value : value === "" ? "" : parseFloat(value),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const processedData = {
      name: formData.name.trim(),
      buyingPrice: parseFloat(formData.buyingPrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantityBought: parseInt(formData.quantityBought, 10),
    };
    onSubmit(processedData);
    setFormData({ name: "", buyingPrice: "", sellingPrice: 250, quantityBought: "" });
  };

  const pricePerUnit =
    formData.buyingPrice && formData.quantityBought
      ? (formData.buyingPrice / formData.quantityBought).toFixed(2)
      : 0;

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {initialData ? "Edit Item" : "Add New Item"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="buyingPrice"
          placeholder="Total Buying Price"
          value={formData.buyingPrice}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="number"
          name="quantityBought"
          placeholder="Quantity Bought"
          value={formData.quantityBought}
          onChange={handleChange}
          required
          className="w-full p-2 border border-gray-300 rounded"
        />
        {formData.buyingPrice && formData.quantityBought && (
          <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded">
            Price per unit: {pricePerUnit}Rs
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded font-semibold text-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
          >
            {initialData ? "Update Item" : "Add Item"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ItemFormModal;
