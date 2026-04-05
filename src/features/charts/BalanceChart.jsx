import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Zap } from "lucide-react";

const BalanceChart = ({ transactions }) => {
  const data = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // 1. DATA CLEANING & SORTING (Sabse important step)
    const sorted = [...transactions]
      .filter((t) => t.date && !isNaN(new Date(t.date).getTime())) // Invalid dates hatayein
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Purane se naya sort karein

    let runningBalance = 0;

    // 2. RUNNING BALANCE CALCULATION
    return sorted.map((t) => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type?.toLowerCase() === "income") {
        runningBalance += amt;
      } else {
        runningBalance -= amt;
      }

      return {
        displayDate: new Date(t.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        balance: runningBalance,
      };
    });
  }, [transactions]);

  // FALLBACK: Agar data empty ho
  if (data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
        <Zap
          size={48}
          strokeWidth={1}
          className="animate-pulse text-brand-primary"
        />
        <p className="text-[10px] uppercase tracking-[0.4em] font-black italic text-white">
          No Ledger Data Detected
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-brand-primary" />
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 italic">
              Balance Trajectory
            </h3>
          </div>
          <p className="text-3xl font-black text-white tracking-tighter italic uppercase">
            Net <span className="text-brand-primary">Equity</span>
          </p>
        </div>
      </div>

      {/* CHART ENGINE */}
      <div
        className="flex-grow min-h-[300px] w-full"
        style={{ position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.03)"
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 900 }}
              dy={10}
              minTickGap={30}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#4b5563", fontSize: 10, fontWeight: 900 }}
              domain={["auto", "auto"]}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-black/80 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                      <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-1 italic">
                        Temporal Index: {payload[0].payload.displayDate}
                      </p>
                      <p className="text-2xl font-black text-white italic tracking-tighter">
                        ${payload[0].value.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={4}
              fill="url(#colorBalance)"
              animationDuration={1500}
              dot={{ r: 4, fill: "#6366f1", strokeWidth: 2, stroke: "#000" }}
              activeDot={{ r: 8, strokeWidth: 0, className: "animate-pulse" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
