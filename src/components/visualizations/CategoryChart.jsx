import React, { useState, useMemo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";
import { PieChart as PieIcon, Activity, TrendingUp } from "lucide-react";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#06b6d4",
];

// 1. Separate Constant-driven Component for cleaner render
const ActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
  fill,
  payload,
  percent,
  value,
}) => (
  <g>
    <text
      x={cx}
      y={cy - 12}
      dy={8}
      textAnchor="middle"
      fill="#94a3b8"
      className="text-[10px] uppercase tracking-[0.2em] font-black italic">
      {payload.name}
    </text>
    <text
      x={cx}
      y={cy + 15}
      dy={8}
      textAnchor="middle"
      className="text-2xl font-black italic tracking-tighter fill-slate-900 dark:fill-white">
      ₹{value.toLocaleString()}
    </text>
    <text
      x={cx}
      y={cy + 35}
      dy={8}
      textAnchor="middle"
      fill={fill}
      className="text-[10px] font-bold">
      {`${(percent * 100).toFixed(1)}%`}
    </text>
    <Sector
      cx={cx}
      cy={cy}
      innerRadius={innerRadius - 2}
      outerRadius={outerRadius + 6}
      startAngle={startAngle}
      endAngle={endAngle}
      fill={fill}
      style={{ opacity: 0.2 }}
    />
    <Sector
      cx={cx}
      cy={cy}
      startAngle={startAngle}
      endAngle={endAngle}
      innerRadius={outerRadius + 10}
      outerRadius={outerRadius + 12}
      fill={fill}
    />
  </g>
);

export default function CategoryChart({ transactions }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // 2. Optimized Data Processing
  const data = useMemo(() => {
    const totals = transactions
      .filter((t) => t.type?.toLowerCase() === "expense")
      .reduce((acc, current) => {
        acc[current.category] =
          (acc[current.category] || 0) + Number(current.amount);
        return acc;
      }, {});

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  // 3. Callback for interaction (Performance)
  const onPieEnter = useCallback((_, index) => setActiveIndex(index), []);

  if (!data.length)
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] opacity-20">
        <PieIcon size={32} className="mb-4 animate-pulse" />
        <p className="text-[10px] uppercase tracking-widest font-black italic">
          No Telemetry Detected
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={12} className="text-indigo-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              Allocation Matrix
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">
            Flux <span className="text-indigo-500">Distribution</span>
          </h2>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="relative flex-grow h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={ActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="80%"
              dataKey="value"
              stroke="none"
              paddingAngle={6}
              onMouseEnter={onPieEnter}
              onClick={onPieEnter}>
              {data.map((_, i) => (
                <Cell
                  key={`cell-${i}`}
                  fill={COLORS[i % COLORS.length]}
                  className="focus:outline-none"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Interactive Legend Grid */}
      <div className="grid grid-cols-2 gap-3 mt-4 max-h-[120px] overflow-y-auto pr-1 custom-scrollbar">
        {data.map((entry, index) => (
          <div
            key={entry.name}
            onClick={() => setActiveIndex(index)}
            onMouseEnter={() => setActiveIndex(index)}
            className={`cursor-pointer flex items-center gap-3 p-2 rounded-2xl transition-all duration-300 border ${
              activeIndex === index
                ? "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10"
                : "border-transparent opacity-50 hover:opacity-100"
            }`}>
            <div
              className="w-1 h-8 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex flex-col truncate">
              <span className="text-[9px] font-black text-slate-500 uppercase italic truncate">
                {entry.name}
              </span>
              <span className="text-sm font-black text-slate-900 dark:text-white tabular-nums">
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
