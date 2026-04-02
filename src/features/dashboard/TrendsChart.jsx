import React, { useContext } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AppContext } from "../../context/AppContext";

const TrendsChart = () => {
  const { transactions } = useContext(AppContext);

  // Data ko chart ke format mein convert karna (Date wise grouping)
  const chartData = transactions
    .reduce((acc, curr) => {
      const existingDate = acc.find((item) => item.date === curr.date);
      if (existingDate) {
        if (curr.type === "income") existingDate.income += curr.amount;
        else existingDate.expense += curr.amount;
      } else {
        acc.push({
          date: curr.date,
          income: curr.type === "income" ? curr.amount : 0,
          expense: curr.type === "expense" ? curr.amount : 0,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-gray-800">Income vs Expenses</h3>
        <p className="text-sm text-gray-500">Daily financial trend</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "#f3f4f6" }}
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Legend verticalAlign="top" align="right" iconType="circle" />
            <Bar
              name="Income"
              dataKey="income"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              name="Expense"
              dataKey="expense"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendsChart;
