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
} from "lucide-react";

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

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm mb-10 group/form overflow-hidden relative">
      {/* Decorative Subtle Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="flex items-center space-x-3 mb-8">
        <div className="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-600 border border-indigo-600/20">
          <PlusCircle size={20} strokeWidth={2.5} />
        </div>
        <h3 className="text-xl font-black text-slate-900 italic tracking-tight uppercase">
          New <span className="text-indigo-600">Entry</span>
        </h3>
      </div>

      <form
        onSubmit={handleAdd}
        className="flex flex-col lg:flex-row gap-5 relative z-10">
        {/* 1. Type Toggle */}
        <div className="relative flex-[0.7]">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            {form.type === "income" ? (
              <ArrowUpCircle
                size={18}
                className="text-emerald-600"
                strokeWidth={3}
              />
            ) : (
              <ArrowDownCircle
                size={18}
                className="text-rose-600"
                strokeWidth={3}
              />
            )}
          </div>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none font-black text-xs uppercase tracking-widest transition-all appearance-none cursor-pointer italic ${
              form.type === "income"
                ? "border-emerald-500/20 bg-emerald-50 text-emerald-700"
                : "border-rose-500/20 bg-rose-50 text-rose-700"
            }`}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* 2. Amount */}
        <div className="relative flex-1 group/input">
          <DollarSign
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors"
          />
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-900 font-bold transition-all placeholder:text-slate-400"
          />
        </div>

        {/* 3. Category */}
        <div className="relative flex-1 group/input">
          <Tag
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full pl-12 pr-8 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-900 font-bold appearance-none cursor-pointer transition-all">
            <option value="" className="text-slate-400">
              Category
            </option>
            {CATEGORY_MAP[form.type].map((cat) => (
              <option key={cat} value={cat} className="text-slate-900">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Date */}
        <div className="relative flex-1 group/input">
          <Calendar
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-indigo-600 transition-colors"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none text-slate-900 font-bold transition-all [color-scheme:light]"
          />
        </div>

        {/* 5. Submit Button */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-10 py-4 rounded-2xl hover:bg-indigo-700 transition-all font-black text-xs uppercase tracking-[0.2em] shadow-md hover:shadow-indigo-200 active:scale-95 flex items-center justify-center space-x-2 shrink-0 italic">
          <Plus size={18} strokeWidth={3} />
          <span>Commit</span>
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
