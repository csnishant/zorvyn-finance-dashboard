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
import { Activity, Zap, Calendar, Tag, Inbox } from "lucide-react";

// 1. Optimized Tooltip: Categorical only, No Redundancy
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hasTransactions = data.details && data.details.length > 0;

    return (
      <div className="glass bg-slate-950/95 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl pointer-events-none select-none min-w-[220px] z-[9999]">
        {/* Header: Date Only */}
        <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-2">
          <Calendar size={12} className="text-indigo-400" />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {data.fullDate}
          </span>
        </div>

        {/* Current Balance */}
        <div className="flex flex-col mb-4">
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">
            Total Equity
          </span>
          <span className="text-2xl font-black text-white tracking-tighter tabular-nums">
            ₹{payload[0].value.toLocaleString()}
          </span>
        </div>

        {/* Category List or No Data Message */}
        <div className="space-y-2">
          <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest block mb-1">
            Activity Details
          </span>

          {hasTransactions ? (
            data.details.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                <div className="flex items-center gap-2">
                  <Tag size={10} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-300 capitalize">
                    {item.category || "Other"}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black ${item.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                  {item.type === "income" ? "+" : "-"}₹
                  {item.amount.toLocaleString()}
                </span>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center py-2 opacity-40">
              <Inbox size={16} className="text-slate-400 mb-1" />
              <p className="text-[9px] font-bold text-slate-400 uppercase">
                No Transactions
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

const BalanceChart = ({ transactions }) => {
  const chartData = useMemo(() => {
    if (!transactions?.length) return [];

    // 1. Sort by actual Date
    const sorted = [...transactions]
      .filter((t) => t.date && !isNaN(new Date(t.date).getTime()))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const groupedData = [];
    let runningBalance = 0;

    // 2. Group by Date Key
    const dayGroups = sorted.reduce((acc, t) => {
      const dateKey = new Date(t.date).toLocaleDateString("en-IN");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(t);
      return acc;
    }, {});

    const sortedDateKeys = Object.keys(dayGroups).sort((a, b) => {
      const [dA, mA, yA] = a.split("/");
      const [dB, mB, yB] = b.split("/");
      return new Date(yA, mA - 1, dA) - new Date(yB, mB - 1, dB);
    });

    sortedDateKeys.forEach((dateKey) => {
      const dayTransactions = dayGroups[dateKey];
      let dailyNetChange = 0;

      dayTransactions.forEach((t) => {
        const amt = parseFloat(t.amount) || 0;
        dailyNetChange += t.type?.toLowerCase() === "income" ? amt : -amt;
      });

      runningBalance += dailyNetChange;

      groupedData.push({
        displayDate: new Date(dayTransactions[0].date).toLocaleDateString(
          "en-IN",
          { month: "short", day: "numeric" },
        ),
        fullDate: new Date(dayTransactions[0].date).toLocaleDateString(
          "en-IN",
          { day: "numeric", month: "long", year: "numeric" },
        ),
        balance: runningBalance,
        details: dayTransactions, // Only relevant day's details
      });
    });

    return groupedData;
  }, [transactions]);

  if (!chartData.length)
    return (
      <div className="h-full flex flex-col items-center justify-center opacity-20 gap-4">
        <Zap size={40} className="animate-pulse text-indigo-500" />
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">
          No Activity
        </p>
      </div>
    );

  return (
    <div className="w-full h-full flex flex-col gap-8 select-none relative">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end px-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
              Live Analytics
            </span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
            Net <span className="text-indigo-500">Worth</span>
          </h2>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic mb-1">
            Peak
          </span>
          <span className="text-xl font-black text-white tracking-tighter tabular-nums">
            ₹{Math.max(...chartData.map((d) => d.balance)).toLocaleString()}
          </span>
        </div>
      </div>

      {/* CHART CANVAS */}
      <div className="flex-grow min-h-[340px] w-full relative pt-6 border-t border-white/[0.03]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="rgba(255,255,255,0.03)"
            />

            <XAxis
              dataKey="displayDate"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 9, fontWeight: 800 }}
              dy={15}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#475569", fontSize: 9, fontWeight: 800 }}
              domain={["auto", "auto"]}
              tickFormatter={(v) =>
                `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`
              }
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "#6366f1",
                strokeWidth: 2,
                strokeDasharray: "4 4",
              }}
              allowEscapeViewBox={{ x: true, y: true }}
              wrapperStyle={{ zIndex: 10000 }}
            />

            <Area
              type="monotone"
              dataKey="balance"
              stroke="#6366f1"
              strokeWidth={4}
              fill="url(#balanceGradient)"
              animationDuration={1500}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#6366f1",
                strokeWidth: 3,
                className: "drop-shadow-[0_0_10px_rgba(99,102,241,0.8)]",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
