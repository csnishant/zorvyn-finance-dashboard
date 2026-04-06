import React, { useMemo, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { Zap, TrendingUp } from "lucide-react";

/* ================= TOOLTIP ================= */

const CustomTooltip = ({ active, payload, coordinate }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hasTransactions = data.details && data.details.length > 0;
    const isRightSide = coordinate?.x > window.innerWidth / 2;

    const desktopStyles = {
      left: isRightSide ? coordinate.x - 300 : coordinate.x + 30,
      top: coordinate.y - 100,
      position: "fixed",
      width: "280px",
    };

    const mobileStyles = {
      left: "50%",
      transform: "translateX(-50%)",
      top: "env(safe-area-inset-top, 12px)",
      width: "92%",
      position: "fixed",
      maxWidth: "420px",
    };

    return (
      <div
        className="z-[9999] pointer-events-none transition-all duration-300"
        style={isMobile ? mobileStyles : desktopStyles}>
        <motion.div
          initial={{ opacity: 0, y: isMobile ? -10 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-4 rounded-[20px] border border-white/10 shadow-2xl backdrop-blur-2xl bg-slate-900/90 flex flex-col gap-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <div className="flex flex-col">
              <span className="text-[8px] font-black uppercase text-indigo-400 tracking-widest italic">
                Snapshot
              </span>
              <p className="text-[10px] font-bold text-white">
                {data.fullDate}
              </p>
            </div>
            <TrendingUp size={14} className="text-indigo-500 animate-pulse" />
          </div>

          {/* Value */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-500 uppercase">
                Net Capital
              </span>
              <span className="text-xl font-black text-white tabular-nums italic">
                ₹{payload[0].value.toLocaleString("en-IN")}
              </span>
            </div>
            <span className="text-[8px] font-black text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full">
              {data.details.length} Events
            </span>
          </div>

          {/* Activity Section */}
          <div className="space-y-1 max-h-[100px] overflow-y-auto pr-1 custom-scrollbar">
            {hasTransactions &&
              data.details.map((item, idx) => {
                const isIncome = item.type?.toLowerCase() === "income";
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-white/[0.03] p-2 rounded-lg border border-white/[0.05]">
                    {/* Category (Left side) */}
                    <span className="text-[10px] font-bold text-slate-300 truncate max-w-[120px]">
                      {item.category}
                    </span>

                    {/* Amount (Right side) */}
                    <span
                      className={`text-[10px] font-black ${
                        isIncome ? "text-emerald-400" : "text-rose-400"
                      }`}>
                      {isIncome ? "+" : "-"}₹
                      {item.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>
    );
  }
  return null;
};

/* ================= MAIN CHART ================= */

export default function BalanceChart({ transactions }) {
  const chartData = useMemo(() => {
    if (!transactions?.length) return [];
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    let runningBalance = 0;
    const grouped = sorted.reduce((acc, t) => {
      const dateKey = new Date(t.date).toISOString().split("T")[0];
      if (!acc[dateKey])
        acc[dateKey] = { rawDate: new Date(t.date), items: [] };
      acc[dateKey].items.push(t);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort()
      .map((key) => {
        const { rawDate, items } = grouped[key];
        const dailyNet = items.reduce(
          (sum, t) =>
            sum +
            (t.type?.toLowerCase() === "income"
              ? parseFloat(t.amount)
              : -parseFloat(t.amount)),
          0,
        );
        runningBalance += dailyNet;

        return {
          displayDate: rawDate.toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          }),
          fullDate: rawDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          balance: runningBalance,
          details: items,
        };
      });
  }, [transactions]);

  return (
    <div className="w-full h-full min-h-[450px] relative bg-slate-950/50 rounded-[32px] p-4 sm:p-8 overflow-visible pt-16">
      <div className="flex items-center gap-3 mb-6 sm:mb-8 ml-2">
        <div className="p-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
          <Zap size={18} className="text-indigo-500" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 italic">
          Cashflow <span className="text-white">Analytics</span>
        </h3>
      </div>

      <div className="w-full h-[280px] sm:h-[300px] mt-12 sm:mt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.03)" />
            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 10, fontWeight: 800 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 10, fontWeight: 800 }}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              wrapperStyle={{ zIndex: 1000 }}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 2,
                strokeDasharray: "4 4",
              }}
              isAnimationActive={false}
              useTranslate3d={false}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={4}
              fill="url(#chartGradient)"
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#6366f1",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
