import React, { useState, useMemo } from "react";
import { useFinance } from "../../hooks/useFinance";
import {
  Trash2,
  Search,
  ArrowUpDown,
  Calendar,
  Tag,
  IndianRupee,
} from "lucide-react";

const TransactionTable = () => {
  const { transactions, role, deleteTransaction, searchTerm, setSearchTerm } =
    useFinance();

  // Only Sort remains local because it's purely for display
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const sortedData = useMemo(() => {
    let data = [...transactions];
    if (sortConfig.key) {
      data.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "date") {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }
        if (sortConfig.key === "amount") {
          valA = Number(valA);
          valB = Number(valB);
        }

        return sortConfig.direction === "asc" ? valA - valB : valB - valA;
      });
    }
    return data;
  }, [transactions, sortConfig]);

  return (
    <div className="transition-all duration-300">
      <div className="p-5 flex flex-col lg:flex-row justify-between items-center gap-5 border-b border-gray-50">
        <div>
          <h3 className="text-xl font-black text-gray-900">Registry List</h3>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">
            {sortedData.length} active sessions
          </p>
        </div>

        {/* Global Search updates Context */}
        <div className="relative w-full sm:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search category..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-widest border-b">
              <th
                className="px-8 py-5 cursor-pointer"
                onClick={() =>
                  setSortConfig({
                    key: "date",
                    direction: sortConfig.direction === "asc" ? "desc" : "asc",
                  })
                }>
                <div className="flex items-center gap-2">
                  <Calendar size={12} /> Date <ArrowUpDown size={12} />
                </div>
              </th>
              <th className="px-8 py-5">Category</th>
              <th className="px-8 py-5">Type</th>
              <th className="px-8 py-5 text-right">Amount</th>
              {role === "admin" && (
                <th className="px-8 py-5 text-center">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sortedData.map((t) => (
              <tr
                key={t.id}
                className="group hover:bg-indigo-50/20 transition-all">
                <td className="px-8 py-5 text-sm text-gray-500">
                  {new Date(t.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-8 py-5 font-bold text-gray-900">
                  {t.category}
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${t.type === "income" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {t.type}
                  </span>
                </td>
                <td
                  className={`px-8 py-5 text-right font-black ${t.type === "income" ? "text-emerald-600" : "text-rose-600"}`}>
                  ₹{t.amount.toLocaleString("en-IN")}
                </td>
                {role === "admin" && (
                  <td className="px-8 py-5 text-center">
                    <button
                      onClick={() => deleteTransaction(t.id)}
                      className="p-2 text-gray-300 hover:text-rose-600 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
