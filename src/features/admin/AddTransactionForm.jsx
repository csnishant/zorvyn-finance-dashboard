import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
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
  const { transactions, setTransactions } = useContext(AppContext);
  const [form, setForm] = useState({
    date: "",
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

    const newTransaction = {
      id: Date.now(),
      ...form,
      amount: Number(form.amount),
    };

    setTransactions([newTransaction, ...transactions]);
    setForm({ date: "", amount: "", category: "", type: "income" });
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
          <PlusCircle size={20} />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Add Transaction</h3>
      </div>

      <form onSubmit={handleAdd} className="flex flex-col lg:flex-row gap-4">
        {/* 1. Transaction Type Toggle-style Select */}
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {form.type === "income" ? (
              <ArrowUpCircle size={18} className="text-emerald-500" />
            ) : (
              <ArrowDownCircle size={18} className="text-rose-500" />
            )}
          </div>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 outline-none font-bold text-sm transition-all appearance-none cursor-pointer ${
              form.type === "income"
                ? "border-emerald-100 bg-emerald-50/50 text-emerald-700"
                : "border-rose-100 bg-rose-50/50 text-rose-700"
            }`}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* 2. Amount Input */}
        <div className="relative flex-1">
          <DollarSign
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="number"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm font-semibold transition-all"
          />
        </div>

        {/* 3. Category Select */}
        <div className="relative flex-1">
          <Tag
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm appearance-none cursor-pointer transition-all">
            <option value="">Category</option>
            {CATEGORY_MAP[form.type].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 4. Date Input */}
        <div className="relative flex-1">
          <Calendar
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none text-sm text-gray-600 transition-all"
          />
        </div>

        {/* 5. Submit Button */}
        <button
          type="submit"
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center space-x-2">
          <Plus size={18} />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
