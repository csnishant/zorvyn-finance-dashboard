import React, { useContext, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { AppContext } from "../../context/AppContext";

const COLORS = [
  "#5856D6",
  "#32D74B",
  "#FF9F0A",
  "#007AFF",
  "#FF375F",
  "#64D2FF",
  "#BF5AF2",
];

const SpendingPieChart = () => {
  const { transactions = [] } = useContext(AppContext);
  const [activeIndex, setActiveIndex] = useState(null);

  const data = useMemo(() => {
    const result = transactions.reduce((acc, t) => {
      const cat = t.category || "Other";
      acc[cat] = (acc[cat] || 0) + Number(t.amount);
      return acc;
    }, {});
    return Object.entries(result)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const totalAmount = data.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="w-full h-[500px] bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col overflow-hidden relative">
      {/* Header */}
      <div className="relative z-20 mb-2 shrink-0">
        <h3 className="text-[18px] font-bold text-gray-900 tracking-tight">
          Spending
        </h3>
        <p className="text-[13px] text-gray-400">Category Breakdown</p>
      </div>

      {/* Main Container for Chart & Legend */}
      <div className="flex-1 relative min-h-0 flex flex-col">
        {data.length > 0 ? (
          <>
            {/* Chart Wrapper - Height restricted to leave space for legend */}
            <div className="relative h-[65%] w-full">
              {/* Center Text (Z-index high to stay on top) */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  Total
                </span>
                <span className="text-xl font-black text-gray-900">
                  ${totalAmount.toLocaleString()}
                </span>
              </div>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="95%" // Thoda chota kiya taaki edge pe crop na ho
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                    cornerRadius={8}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}>
                    {data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                        className="outline-none"
                        style={{
                          opacity:
                            activeIndex === null || activeIndex === index
                              ? 1
                              : 0.6,
                          transition: "opacity 300ms ease",
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload?.length) {
                        return (
                          <div className="bg-white border border-gray-100 shadow-2xl p-3 rounded-2xl z-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">
                              {payload[0].name}
                            </p>
                            <p className="text-sm font-bold text-gray-900">
                              ${payload[0].value.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend Section - Not Absolute, but part of Flex Column */}
            <div className="h-[35%] overflow-y-auto mt-4 px-2 no-scrollbar">
              <div className="grid grid-cols-2 gap-3 pb-4">
                {data.map((entry, index) => (
                  <div
                    key={entry.name}
                    className="flex items-center justify-between bg-gray-50/50 p-2 rounded-xl border border-gray-50">
                    <div className="flex items-center space-x-2 truncate">
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-[12px] text-gray-700 font-medium truncate">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-semibold ml-2">
                      {((entry.value / totalAmount) * 100).toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
            <div className="w-12 h-12 bg-gray-50 rounded-full mb-2 flex items-center justify-center text-xl">
              📊
            </div>
            <p className="text-sm">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpendingPieChart;
