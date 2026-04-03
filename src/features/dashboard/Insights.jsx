import React, { useContext, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import { TrendingUp, TrendingDown, Zap, PieChart, Info } from "lucide-react";

const Insights = () => {
  const { transactions = [] } = useContext(AppContext);

  // 1. Highest Spending Logic
  const highestSpending = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const grouped = expenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
      return acc;
    }, {});

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
    return sorted[0]; // [category, amount]
  }, [transactions]);

  // 2. Monthly Comparison Logic
  const monthlyComparison = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Previous month logic for Year-boundary (Jan -> Dec)
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentTotal = 0;
    let prevTotal = 0;

    transactions.forEach((t) => {
      const date = new Date(t.date);
      if (t.type === "expense") {
        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        )
          currentTotal += Number(t.amount);
        if (date.getMonth() === prevMonth && date.getFullYear() === prevYear)
          prevTotal += Number(t.amount);
      }
    });

    const diff = currentTotal - prevTotal;
    const percent = prevTotal ? ((diff / prevTotal) * 100).toFixed(1) : 0;

    return { currentTotal, prevTotal, percent: Number(percent) };
  }, [transactions]);

  return (
    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 mt-8">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
          <Zap size={20} fill="currentColor" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Smart Insights</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Insight 1: Highest Spending */}
        <div className="group p-5 bg-gray-50/50 rounded-[24px] border border-transparent hover:border-indigo-100 hover:bg-white transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <PieChart size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Category Focus
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1 font-medium">Top Category</p>
          <h4 className="text-xl font-black text-gray-900">
            {highestSpending ? highestSpending[0] : "No Data"}
          </h4>
          <p className="text-xs text-indigo-500 font-bold mt-1">
            ${highestSpending ? highestSpending[1].toLocaleString() : 0} spent
          </p>
        </div>

        {/* Insight 2: Monthly Change */}
        <div className="group p-5 bg-gray-50/50 rounded-[24px] border border-transparent hover:border-gray-200 hover:bg-white transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div
              className={`p-2 rounded-xl ${monthlyComparison.percent > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
              {monthlyComparison.percent > 0 ? (
                <TrendingUp size={18} />
              ) : (
                <TrendingDown size={18} />
              )}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Trend Analysis
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1 font-medium">
            Monthly Change
          </p>
          <h4
            className={`text-xl font-black ${monthlyComparison.percent > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {monthlyComparison.percent > 0
              ? `+${monthlyComparison.percent}`
              : monthlyComparison.percent}
            %
          </h4>
          <p className="text-xs text-gray-400 font-bold mt-1">
            vs previous month
          </p>
        </div>

        {/* Insight 3: Observation */}
        <div className="group p-5 bg-gray-900 rounded-[24px] text-white shadow-xl shadow-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white/10 text-white rounded-xl">
              <Info size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-white/40">
              Suggestion
            </span>
          </div>
          <p className="text-sm text-white/60 mb-1 font-medium">
            Daily Observation
          </p>
          <h4 className="text-[15px] font-bold leading-tight">
            {monthlyComparison.percent > 0
              ? "You're spending faster than last month. Try to limit non-essentials. ⚠️"
              : "Excellent! You've managed to lower your expenses. Keep it up! 🏆"}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Insights;
