// src/features/admin/AddTransactionForm.jsx
import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const categories = ["Salary", "Food", "Shopping", "Rent", "Entertainment"];

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
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category) {
      return alert("All fields required");
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
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6">
      <h3 className="text-lg font-bold mb-4 text-gray-700">
        Add New Transaction
      </h3>

      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* 1. Date Input */}
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="border p-2 rounded-md focus:ring-2 focus:ring-fuchsia-500 outline-none"
        />

        {/* 2. Amount Input */}
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          className="border p-2 rounded-md focus:ring-2 focus:ring-fuchsia-500 outline-none"
        />

        {/* 3. Category Select */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded-md focus:ring-2 focus:ring-fuchsia-500 outline-none">
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* 4. Type Select */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border p-2 rounded-md focus:ring-2 focus:ring-fuchsia-500 outline-none">
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* 5. Submit Button */}
        <button
          type="submit"
          className="bg-fuchsia-600 text-white px-4 py-2 rounded-md hover:bg-fuchsia-700 transition-colors font-semibold">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddTransactionForm;
