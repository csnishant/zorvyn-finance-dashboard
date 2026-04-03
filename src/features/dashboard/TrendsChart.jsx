import React, { useContext, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AppContext } from "../../context/AppContext";

const TrendsChart = () => {
  const { transactions = [] } = useContext(AppContext);

  const chartData = useMemo(() => {
    const grouped = transactions.reduce((acc, curr) => {
      const dateStr = new Date(curr.date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
      });
      const existingDate = acc.find((item) => item.date === dateStr);

      const amount = Number(curr.amount);
      if (existingDate) {
        if (curr.type === "income") existingDate.income += amount;
        else existingDate.expense += amount;
      } else {
        acc.push({
          date: dateStr,
          income: curr.type === "income" ? amount : 0,
          expense: curr.type === "expense" ? amount : 0,
        });
      }
      return acc;
    }, []);

    return grouped
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-7); // Last 7 days for mobile clarity
  }, [transactions]);

  return (
    <div className="w-full h-[500px] bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col overflow-hidden">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-6 shrink-0">
        <div>
          <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">
            Trends
          </h3>
          <p className="text-[13px] text-gray-400 font-medium">
            Income vs Expenses
          </p>
        </div>
        <div className="flex space-x-3 text-[11px] font-bold uppercase tracking-wider">
          <div className="flex items-center text-emerald-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />{" "}
            Income
          </div>
          <div className="flex items-center text-rose-500">
            <span className="w-2 h-2 rounded-full bg-rose-500 mr-1.5" /> Expense
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 min-h-0 w-full mt-2">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              barGap={8}>
              <CartesianGrid
                strokeDasharray="0"
                vertical={false}
                stroke="#F3F4F6"
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: "#F9FAFB", radius: 8 }}
                content={({ active, payload }) => {
                  if (active && payload?.length) {
                    return (
                      <div className="bg-white/90 backdrop-blur-md border border-gray-100 shadow-2xl p-3 rounded-2xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 border-b pb-1">
                          {payload[0].payload.date}
                        </p>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-emerald-600 flex justify-between">
                            In:{" "}
                            <span>${payload[0].value.toLocaleString()}</span>
                          </p>
                          <p className="text-xs font-bold text-rose-600 flex justify-between gap-4">
                            Out:{" "}
                            <span>${payload[1].value.toLocaleString()}</span>
                          </p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Income Bar */}
              <Bar
                name="Income"
                dataKey="income"
                fill="#10B981"
                radius={[6, 6, 6, 6]}
                barSize={window.innerWidth < 768 ? 12 : 16}
                animationDuration={1500}
              />

              {/* Expense Bar */}
              <Bar
                name="Expense"
                dataKey="expense"
                fill="#EF4444"
                radius={[6, 6, 6, 6]}
                barSize={window.innerWidth < 768 ? 12 : 16}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-300">
            <p className="text-sm">No activity trend found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsChart;
