import React, { useState } from "react";
import { useFinance } from "../../hooks/useFinance";
import {
  DollarSign,
  Calendar,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_MAP = {
  income: ["Salary", "Bonus", "Freelance", "Investment", "Other Income"],
  expense: ["Food", "Shopping", "Rent", "Entertainment", "Health", "Bills"],
};

const AddTransactionForm = () => {
  const { addTransaction } = useFinance();
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    amount: "",
    category: "",
    type: "income",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      category: name === "type" ? "" : prev.category,
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category)
      return alert("Fill all fields!");
    addTransaction({ ...form, amount: Number(form.amount) });
    setForm({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      category: "",
      type: "income",
    });
  };

  const isIncome = form.type === "income";

  // Reusable Input Wrapper Style
  const inputBaseClass =
    "w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50/50 dark:bg-white/[0.03] border-none outline-none text-slate-900 dark:text-white font-bold transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500/20 group-hover:bg-white dark:group-hover:bg-white/[0.05]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-1 rounded-[2.5rem] shadow-2xl group/form">
      {/* Inner Container to give that subtle gradient border effect */}
      <div className="bg-[#F9F9F7] dark:bg-slate-950/80 rounded-[2.4rem] p-6 sm:p-8">
        {/* Animated Background Glows */}
        <AnimatePresence mode="wait">
          <motion.div
            key={form.type}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute -top-24 -left-24 w-72 h-72 blur-[120px] pointer-events-none -z-10 ${
              isIncome ? "bg-emerald-500/20" : "bg-rose-500/20"
            }`}
          />
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">
              New Entry
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                Add{" "}
                <span
                  className={isIncome ? "text-emerald-500" : "text-rose-500"}>
                  {isIncome ? "Income" : "Expense"}
                </span>
              </span>
              <Sparkles size={16} className="text-indigo-500 animate-pulse" />
            </div>
          </div>

          {/* Toggle Button Inside Header (Modern Approach) */}
          <div className="flex p-1 bg-slate-200/50 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5">
            <button
              onClick={() =>
                handleChange({ target: { name: "type", value: "income" } })
              }
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isIncome ? "bg-white dark:bg-slate-800 text-emerald-500 shadow-sm" : "text-slate-500"}`}>
              Income
            </button>
            <button
              onClick={() =>
                handleChange({ target: { name: "type", value: "expense" } })
              }
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!isIncome ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm" : "text-slate-500"}`}>
              Expense
            </button>
          </div>
        </div>

        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Amount Input */}
          <div className="relative group lg:col-span-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 group-focus-within:text-indigo-500 group-focus-within:bg-indigo-500/10 transition-all">
              <DollarSign size={16} />
            </div>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              className={inputBaseClass}
            />
          </div>

          {/* Category Select */}
          <div className="relative group lg:col-span-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 group-focus-within:text-indigo-500 transition-all">
              <Tag size={16} />
            </div>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={`${inputBaseClass} appearance-none cursor-pointer`}>
              <option value="">Select Category</option>
              {CATEGORY_MAP[form.type].map((cat) => (
                <option key={cat} value={cat} className="dark:bg-slate-900">
                  {cat}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>

          {/* Date Input */}
          <div className="relative group lg:col-span-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 bg-slate-100 dark:bg-white/5 rounded-lg text-slate-400 group-focus-within:text-indigo-500 transition-all">
              <Calendar size={16} />
            </div>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className={`${inputBaseClass} [color-scheme:light] dark:[color-scheme:dark]`}
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="lg:col-span-1 bg-indigo-600 dark:bg-indigo-500 text-white py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all italic overflow-hidden relative group/btn">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]" />
            <Plus size={18} strokeWidth={3} />
            <span>Add</span>
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default AddTransactionForm;
