// src/features/dashboard/SummaryCards.jsx
import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext"; // Context se data lenge
import { calculateSummary } from "../../utils/stats"; // Utils se math logic lenge

const SummaryCards = () => {
  // 1. Context se actual transactions data nikaalein
  const { transactions } = useContext(AppContext);

  // 2. Data ko calculation function mein bhejein
  const { balance, income, expense } = calculateSummary(transactions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Balance Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition-all hover:border-fuchsia-500/50">
        <p className="text-slate-400 text-sm font-medium">Total Balance</p>
        <h2 className="text-3xl font-bold text-white mt-2">
          ₹{balance.toLocaleString("en-IN")}
        </h2>
      </div>

      {/* Income Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition-all hover:border-green-500/50">
        <p className="text-green-400 text-sm font-medium">Total Income</p>
        <h2 className="text-3xl font-bold text-white mt-2">
          ₹{income.toLocaleString("en-IN")}
        </h2>
      </div>

      {/* Expense Card */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition-all hover:border-red-500/50">
        <p className="text-red-400 text-sm font-medium">Total Expenses</p>
        <h2 className="text-3xl font-bold text-white mt-2">
          ₹{expense.toLocaleString("en-IN")}
        </h2>
      </div>
    </div>
  );
};

export default SummaryCards;
