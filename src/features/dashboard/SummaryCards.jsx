import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { calculateSummary } from "../../utils/stats";
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";

const SummaryCards = () => {
  const { transactions = [] } = useContext(AppContext);
  const { balance, income, expense } = calculateSummary(transactions);

  const stats = [
    {
      label: "Total Balance",
      value: balance,
      icon: <Wallet size={20} />,
      bg: "bg-indigo-50",
      text: "text-indigo-600",
      trend: "Overall Wealth",
      accent: "bg-indigo-600",
    },
    {
      label: "Total Income",
      value: income,
      icon: <ArrowUpRight size={20} />,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      trend: "Monthly Earnings",
      accent: "bg-emerald-600",
    },
    {
      label: "Total Expenses",
      value: expense,
      icon: <ArrowDownRight size={20} />,
      bg: "bg-rose-50",
      text: "text-rose-600",
      trend: "Spending Flow",
      accent: "bg-rose-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
      {stats.map((item, index) => (
        <div
          key={index}
          className="group relative overflow-hidden bg-white p-5 md:p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col justify-between">
          {/* Decorative Background Element (Mobile par premium lagta hai) */}
          <div
            className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${item.bg} opacity-20 group-hover:scale-150 transition-transform duration-700`}
          />

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div
              className={`p-3 ${item.bg} ${item.text} rounded-2xl shadow-sm`}>
              {item.icon}
            </div>
            <div className="flex flex-col items-end text-right">
              <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-1">
                {item.trend}
              </span>
              <div className="flex items-center space-x-1 text-emerald-500 text-[10px] font-bold">
                <TrendingUp size={10} />
                <span>Active</span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-sm font-bold text-gray-500 mb-1">{item.label}</p>
            <div className="flex items-baseline space-x-1">
              <span className="text-gray-400 text-lg font-medium">₹</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
                {item.value.toLocaleString("en-IN")}
              </h2>
            </div>
          </div>

          {/* Bottom Accent Line (Customization for Desktop vs Mobile) */}
          <div className="mt-6 flex items-center space-x-2">
            <div className={`h-1.5 w-12 rounded-full ${item.accent}`} />
            <div className="h-1.5 flex-1 rounded-full bg-gray-100" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
