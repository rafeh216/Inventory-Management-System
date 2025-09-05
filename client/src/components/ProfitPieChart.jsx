import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#FF6B6B", "#4ECDC4", "#FFD93D", "#6A0572", "#1982C4", "#8AC926",
  "#FFCA3A", "#FF595E", "#6A0572", "#1982C4", "#7F00FF", "#00B8A9",
  "#F6416C", "#43E97B", "#30CFCF", "#FF9F1C", "#2EC4B6", "#E71D36",
  "#011627", "#F77F00", "#8338EC", "#3A86FF", "#06D6A0", "#EF476F",
  "#118AB2", "#073B4C", "#FFC857", "#FF6F91", "#845EC2", "#00C9A7",
];

const ProfitPieChart = ({ data, cashInHand }) => {
  if (!Array.isArray(data)) {
    return <p>No data available.</p>;
  }

  const chartData = data.map((item) => ({
    name: item.name,
    profit: Number(item.profit?.toFixed(2)) || 0,
  }));

  const totalProfit = chartData.reduce((acc, item) => acc + item.profit, 0);

  return (
    <div className="bg-surface p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-center">
      <div className="w-full md:w-3/4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="profit"
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name }) => name}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 md:mt-0 md:ml-6 text-right">
        <p className="text-lg font-semibold">💰 Total Sale:</p>
        <p className="text-2xl font-bold text-blue-500 mb-4">
          Rs: {cashInHand}
        </p>

        <p className="text-lg font-semibold">📈 Total Profit:</p>
        <p className="text-2xl font-bold text-green-400">
          Rs: {totalProfit.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProfitPieChart;
