import React, { useState } from "react";
import { useFinance } from "../../hooks/useFinance";
import {
  PlusCircle,
  DollarSign,
  Calendar,
  Tag,
  ArrowUpCircle,
  ArrowDownCircle,
  Plus,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

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
    if (name === "type") {
      setForm((prev) => ({ ...prev, [name]: value, category: "" }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category) {
      return alert("Please fill all fields!");
    }

    addTransaction({
      date: form.date,
      amount: Number(form.amount),
      category: form.category,
      type: form.type,
    });

    setForm({
      date: new Date().toISOString().split("T")[0],
      amount: "",
      category: "",
      type: "income",
    });
  };

  const isIncome = form.type === "income";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-white/70 dark:bg-slate-900/50 backdrop-blur-xl p-6 sm:p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800 shadow-xl group/form">
      {/* Dynamic Background Glow */}
      <div
        className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] pointer-events-none transition-colors duration-700 ${
          isIncome ? "bg-emerald-500/10" : "bg-rose-500/10"
        }`}
      />

      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center space-x-4">
          <div
            className={`p-3 rounded-2xl border transition-all duration-500 ${
              isIncome
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                : "bg-rose-500/10 text-rose-600 border-rose-500/20 shadow-[0_0_20px_rgba(244,63,94,0.1)]"
            }`}>
            <PlusCircle size={22} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white italic tracking-tight uppercase">
              Add{" "}
              <span className={isIncome ? "text-emerald-500" : "text-rose-500"}>
                Transaction
              </span>
            </h3>
           
          </div>
        </div>
        <Sparkles
          size={18}
          className="text-slate-300 dark:text-slate-700 animate-pulse hidden sm:block"
        />
      </div>

      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
        {/* 1. Type Toggle with Premium Animation */}
        <div className="relative group/input lg:col-span-1">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            {isIncome ? (
              <ArrowUpCircle
                size={18}
                className="text-emerald-500"
                strokeWidth={3}
              />
            ) : (
              <ArrowDownCircle
                size={18}
                className="text-rose-500"
                strokeWidth={3}
              />
            )}
          </div>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-black text-[11px] uppercase tracking-widest transition-all appearance-none cursor-pointer italic ${
              isIncome
                ? "border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/5 text-emerald-700 dark:text-emerald-400"
                : "border-rose-500/20 bg-rose-50/50 dark:bg-rose-500/5 text-rose-700 dark:text-rose-400"
            } hover:border-current/40`}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* 2. Amount */}
        <div className="relative group/input lg:col-span-1">
          <DollarSign
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors"
          />
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-900 dark:text-white font-bold transition-all placeholder:text-slate-400"
          />
        </div>

        {/* 3. Category */}
        <div className="relative group/input lg:col-span-1">
          <Tag
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full pl-12 pr-8 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 focus:border-indigo-500/50 outline-none text-slate-900 dark:text-white font-bold appearance-none cursor-pointer transition-all">
            <option value="" className="dark:bg-slate-900">
              Category
            </option>
            {CATEGORY_MAP[form.type].map((cat) => (
              <option key={cat} value={cat} className="dark:bg-slate-900">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Date */}
        <div className="relative group/input lg:col-span-1">
          <Calendar
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-500 transition-colors"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 focus:border-indigo-500/50 outline-none text-slate-900 dark:text-white font-bold transition-all [color-scheme:dark] dark:[color-scheme:dark]"
          />
        </div>

        {/* 5. Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-indigo-600 text-white px-8 py-4 rounded-2xl hover:bg-indigo-500 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 flex items-center justify-center space-x-2 shrink-0 italic lg:col-span-1">
          <Plus size={18} strokeWidth={3} />
          <span>Add</span>
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddTransactionForm;
