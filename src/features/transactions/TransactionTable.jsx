import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Trash2,
  Search,
  ArrowUpDown,
  Filter,
  Calendar,
  Tag,
  IndianRupee,
} from "lucide-react";

const TransactionTable = () => {
  const { transactions, setTransactions, role } = useContext(AppContext);

  // States for Filter, Search and Sort
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // --- CORE LOGIC: Filtering, Searching & Sorting ---
  const processedData = useMemo(() => {
    // 1. Filter by Search Term and Type
    let data = [...transactions].filter((t) => {
      const categoryMatch = t.category
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const typeMatch = filterType === "all" || t.type === filterType;
      return categoryMatch && typeMatch;
    });

    // 2. Sort Logic
    if (sortConfig.key) {
      data.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Date sorting logic
        if (sortConfig.key === "date") {
          valA = new Date(valA).getTime() || 0;
          valB = new Date(valB).getTime() || 0;
        }

        // Amount sorting logic (Ensuring numbers)
        if (sortConfig.key === "amount") {
          valA = Number(valA);
          valB = Number(valB);
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return data;
  }, [transactions, searchTerm, filterType, sortConfig]);

  // Handler for Sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden mt-8 transition-all duration-300">
      {/* --- TABLE CONTROLS SECTION --- */}
      <div className="p-5 md:p-7 border-b border-gray-50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">
            Transactions List
          </h3>
          <p className="text-xs text-gray-400 font-bold mt-1 uppercase tracking-widest">
            {processedData.length} records found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search category..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <div className="relative w-full sm:w-44">
            <Filter
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 focus:ring-2 focus:ring-indigo-500/20 outline-none appearance-none cursor-pointer"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">All Records</option>
              <option value="income">Income Only</option>
              <option value="expense">Expenses Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- RESPONSIVE TABLE WRAPPER --- */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-gray-400 text-[11px] font-black uppercase tracking-widest border-b border-gray-100">
              <th
                className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors"
                onClick={() => requestSort("date")}>
                <div className="flex items-center gap-2">
                  <Calendar size={12} /> Date{" "}
                  <ArrowUpDown size={12} className="opacity-50" />
                </div>
              </th>
              <th className="px-8 py-5">
                <div className="flex items-center gap-2">
                  <Tag size={12} /> Category
                </div>
              </th>
              <th className="px-8 py-5">Flow Type</th>
              <th
                className="px-8 py-5 cursor-pointer hover:text-indigo-600 transition-colors text-right"
                onClick={() => requestSort("amount")}>
                <div className="flex items-center justify-end gap-2">
                  <IndianRupee size={12} /> Amount{" "}
                  <ArrowUpDown size={12} className="opacity-50" />
                </div>
              </th>
              {role === "admin" && (
                <th className="px-8 py-5 text-center font-bold">Action</th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {processedData.map((t) => (
              <tr
                key={t.id}
                className="group hover:bg-indigo-50/20 transition-all duration-200">
                <td className="px-8 py-5 text-sm text-gray-500 font-medium whitespace-nowrap">
                  {new Date(t.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="px-8 py-5">
                  <span className="text-sm font-bold text-gray-900">
                    {t.category}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      t.type === "income"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}>
                    {t.type}
                  </span>
                </td>
                <td
                  className={`px-8 py-5 text-right font-black text-base ${
                    t.type === "income" ? "text-emerald-600" : "text-rose-600"
                  }`}>
                  {t.type === "income" ? "+" : "-"} ₹
                  {t.amount.toLocaleString("en-IN")}
                </td>

                {role === "admin" && (
                  <td className="px-8 py-5 text-center">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="p-2.5 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* --- EMPTY STATE HANDLER --- */}
        {processedData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="p-5 bg-gray-50 rounded-full mb-4 text-gray-300 border border-gray-100 shadow-inner">
              <Search size={48} strokeWidth={1.5} />
            </div>
            <h4 className="text-gray-900 font-black text-lg">
              No Results Found
            </h4>
            <p className="text-sm text-gray-400 mt-1 max-w-[240px]">
              We couldn't find anything matching your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterType("all");
              }}
              className="mt-6 text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
