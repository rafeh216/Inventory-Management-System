import React, { useEffect, useState } from "react";
import API, { getSalesHistory, deleteSale } from "../api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SalesHistory = () => {
  const [sales, setSales] = useState([]);
  const [filteredDate, setFilteredDate] = useState("");

  useEffect(() => {
    getSalesHistory()
      .then((res) => {
        if (Array.isArray(res.data)) setSales(res.data);
        else setSales([]);
      })
      .catch(() => setSales([]));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this entry?")) return;
    try {
      await deleteSale(id);
      setSales((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };

  const handleDateChange = (e) => {
    setFilteredDate(e.target.value);
  };

  const clearFilter = () => setFilteredDate("");

  const filteredSales = filteredDate
    ? sales.filter((sale) => {
        const localDate = new Date(sale.dateSold).toLocaleDateString("en-CA");
        return localDate === filteredDate;
      })
    : sales;

  const groupedSales = filteredSales.reduce((acc, sale) => {
    const date = new Date(sale.dateSold).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(sale);
    return acc;
  }, {});

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Sales Report", 14, 15);
    if (filteredDate) doc.text(`Date: ${filteredDate}`, 14, 22);

    const tableData = [];
    Object.entries(groupedSales).forEach(([date, salesList]) => {
      salesList.forEach((sale) => {
        tableData.push([
          date,
          sale.itemId?.name || "Deleted Item",
          sale.quantitySold,
          `Rs. ${sale.priceAtSale?.toFixed(2)}`,
        ]);
      });
    });

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Item", "Quantity", "Price Per Unit"]],
      body: tableData,
    });

    doc.save(
      filteredDate ? `Sales_Report_${filteredDate}.pdf` : "Sales_Report_All.pdf"
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Sales History</h1>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filteredDate}
            onChange={handleDateChange}
            className="border border-gray-300 p-2 rounded-md text-sm"
          />
          {filteredDate && (
            <button
              onClick={clearFilter}
              className="text-blue-600 hover:underline text-sm"
            >
              Clear Filter
            </button>
          )}
        </div>
        <button
          onClick={exportPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Export as PDF
        </button>
      </div>

      {sales.length === 0 ? (
        <p className="text-center text-gray-500">No sales history available.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
          {Object.entries(groupedSales).map(([date, daySales]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold mb-2 text-accent border-b pb-1">{date}</h2>
              {daySales.map((sale) => (
                <div
                  key={sale._id}
                  className="flex justify-between items-center border-b border-gray-200 pb-3 mb-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      {sale.itemId?.name || "Deleted Item"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      Sold at Rs. {sale.priceAtSale?.toFixed(2) || "N/A"} per piece
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-blue-600">{sale.quantitySold} pcs</p>
                    <button
                      onClick={() => handleDelete(sale._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SalesHistory;
