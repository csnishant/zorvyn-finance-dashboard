import React, { useState, useMemo } from "react";
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

const renderActiveShape = (props) => {
  const {
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
  } = props;

  return (
    <g>
      {/* Central Label - Responsive font sizes */}
      <text
        x={cx}
        y={cy - 12}
        dy={8}
        textAnchor="middle"
        fill="#94a3b8"
        className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] font-black italic">
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 15}
        dy={8}
        textAnchor="middle"
        fill="currentColor"
        className="text-xl sm:text-2xl font-black italic tracking-tighter fill-slate-900 dark:fill-white">
        ₹{value.toLocaleString()}
      </text>
      <text
        x={cx}
        y={cy + 35}
        dy={8}
        textAnchor="middle"
        fill={fill}
        className="text-[8px] sm:text-[10px] font-bold">
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
        className="opacity-20 transition-all duration-500"
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
};

export default function CategoryChart({ transactions }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const data = useMemo(() => {
    const expenses = transactions.filter(
      (t) => t.type?.toLowerCase() === "expense",
    );
    const totals = {};
    expenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount);
    });

    return Object.entries(totals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
        <PieIcon size={32} className="mb-4 opacity-20 animate-pulse" />
        <p className="text-[10px] uppercase tracking-widest font-black italic">
          No Data Found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      {/* 1. Header Section */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={12} className="text-indigo-500" />
            <h3 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">
              Insight Engine
            </h3>
          </div>
          <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tighter italic">
            Allocation
          </p>
        </div>
        <div className="hidden sm:flex bg-emerald-500/10 text-emerald-600 p-2 rounded-xl border border-emerald-500/20 shadow-sm">
          <TrendingUp size={14} />
        </div>
      </div>

      {/* 2. Chart Section - Properly sized for Mobile */}
      <div className="relative flex-grow h-[250px] sm:h-[300px] w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="80%"
              dataKey="value"
              stroke="none"
              paddingAngle={5}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onClick={(_, index) => setActiveIndex(index)} // Touch support
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload?.length) {
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-3 rounded-xl shadow-xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase italic">
                        {payload[0].name}
                      </p>
                      <p className="text-sm font-black text-slate-900 dark:text-white">
                        ₹{payload[0].value.toLocaleString()}
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

      {/* 3. Legend Section - Grid that wraps correctly */}
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 mt-4 max-h-[140px] overflow-y-auto custom-scrollbar pr-1">
        {data.map((entry, index) => (
          <motion.div
            key={entry.name}
            className={`flex items-center gap-2 p-2 rounded-xl transition-all ${
              activeIndex === index
                ? "bg-slate-100 dark:bg-slate-800"
                : "opacity-60"
            }`}
            onMouseEnter={() => setActiveIndex(index)}>
            <div
              className="w-1 h-6 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-[8px] font-black text-slate-400 uppercase truncate italic">
                {entry.name}
              </span>
              <span className="text-[11px] font-bold text-slate-900 dark:text-white truncate tabular-nums">
                ₹{entry.value.toLocaleString()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
