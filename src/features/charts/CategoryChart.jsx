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
import { PieChart as PieIcon } from "lucide-react";

// Cyber-vibrant colors
const COLORS = [
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#fb923c",
  "#22d3ee",
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
      {/* Central Label */}
      <text
        x={cx}
        y={cy - 10}
        dy={8}
        textAnchor="middle"
        fill="#9ca3af"
        className="text-[10px] uppercase tracking-[0.3em] font-black italic">
        {payload.name}
      </text>
      <text
        x={cx}
        y={cy + 20}
        dy={8}
        textAnchor="middle"
        fill="#fff"
        className="text-2xl font-black italic tracking-tighter">
        {`${(percent * 100).toFixed(0)}%`}
      </text>

      {/* Active Sector Animation */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        className="drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 14}
        outerRadius={outerRadius + 16}
        fill={fill}
      />
    </g>
  );
};

export default function CategoryChart({ transactions }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
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
      <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
        <PieIcon size={48} strokeWidth={1} />
        <p className="text-[10px] uppercase tracking-[0.4em] font-black italic">
          No Expense Data
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full relative">
      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-brand-primary italic">
            Distribution
          </h3>
          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">
            Resource Allocation Index
          </p>
        </div>
      </div>

      {/* Chart Engine */}
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              dataKey="value"
              stroke="none"
              onMouseEnter={(_, index) => setActiveIndex(index)}
              animationBegin={0}
              animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/80 border border-white/10 backdrop-blur-md p-3 rounded-lg shadow-2xl">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                        {payload[0].name}
                      </p>
                      <p className="text-sm font-black text-white mt-1">
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

      {/* Custom Legend Pipeline */}
      <div className="grid grid-cols-2 gap-4 mt-6 border-t border-white/[0.05] pt-6 overflow-y-auto max-h-[150px] custom-scrollbar">
        {data.map((entry, index) => (
          <div
            key={entry.name}
            className={`flex items-center gap-3 transition-opacity duration-300 ${activeIndex === index ? "opacity-100" : "opacity-40"}`}
            onMouseEnter={() => setActiveIndex(index)}>
            <div
              className="w-1.5 h-6 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate w-24 italic">
                {entry.name}
              </span>
              <span className="text-xs font-bold text-white tabular-nums">
                ${entry.value.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
