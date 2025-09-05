import React, { useState } from "react";
import API, { deleteItem } from "../api";
import { Trash2, Check } from "lucide-react";

const ItemCard = ({ item, onUpdated }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...item });

  const save = async () => {
    try {
      const addedQuantity = Number(form.quantityBought) - item.quantityBought;
      const newSellingPrice =
        Number(form.sellingPrice) !== Number(item.sellingPrice)
          ? Number(form.sellingPrice)
          : null;

      if (addedQuantity > 0 || newSellingPrice !== null) {
        await API.put(`/items/update-stock-price/${item._id}`, {
          addedQuantity: addedQuantity > 0 ? addedQuantity : 0,
          newSellingPrice,
        });
      }

      if (form.name !== item.name || form.totalCost !== item.totalCost) {
        await API.put(`/items/${item._id}`, {
          name: form.name,
          totalCost: form.totalCost,
        });
      }

      setEditing(false);
      onUpdated();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Delete item "${item.name}"? This cannot be undone.`)) {
      await deleteItem(item._id);
      onUpdated();
    }
  };

  return (
    <div className="bg-surface rounded-xl p-4 shadow-md text-textPrimary flex flex-col justify-between">
      {editing ? (
        <div className="space-y-2">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-background p-1 rounded"
          />
          <input
            value={form.totalCost}
            onChange={(e) => setForm({ ...form, totalCost: e.target.value })}
            type="number"
            className="w-full bg-background p-1 rounded"
          />
          <input
            value={form.sellingPrice}
            onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
            type="number"
            className="w-full bg-background p-1 rounded"
          />
          <input
            value={form.quantityBought}
            onChange={(e) =>
              setForm({ ...form, quantityBought: e.target.value })
            }
            type="number"
            className="w-full bg-background p-1 rounded"
          />
          <button
            onClick={save}
            className="bg-accent text-black w-full py-1 rounded mt-2 flex items-center justify-center gap-2"
          >
            <Check size={16} /> Done
          </button>
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-xl font-bold">{item.name}</h2>
            <p>Qty Left: {item.quantityRemaining}</p>
            <p>Profit: Rs. {(item?.profit ?? 0).toFixed(2)}</p>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-accent hover:underline"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-warning hover:underline flex items-center gap-1"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ItemCard;
