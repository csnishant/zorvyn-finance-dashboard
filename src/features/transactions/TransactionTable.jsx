import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Trash2, Search } from "lucide-react";

const TransactionTable = () => {
  const { transactions, setTransactions, role } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Logic: Search aur Filter apply karna
  const filteredData = transactions.filter((t) => {
    const matchesSearch = t.category
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    return matchesSearch && matchesType;
  });

  // Action: Delete (Only for Admin)
  const handleDelete = (id) => {
    if (window.confirm("Delete this transaction?")) {
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
      <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-700">Recent Transactions</h3>

        <div className="flex gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search category..."
              className="pl-9 pr-4 py-2 border rounded-lg text-sm focus:outline-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <select
            className="border rounded-lg px-3 py-2 text-sm focus:outline-blue-500"
            onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
            <tr>
              <th className="px-6 py-4 font-semibold">Date</th>
              <th className="px-6 py-4 font-semibold">Category</th>
              <th className="px-6 py-4 font-semibold">Type</th>
              <th className="px-6 py-4 font-semibold text-right">Amount</th>
              {role === "Admin" && (
                <th className="px-6 py-4 font-semibold text-center">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-600">{t.date}</td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {t.category}
                </td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${
                      t.type === "income"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}>
                    {t.type}
                  </span>
                </td>
                <td
                  className={`px-6 py-4 text-right font-bold ${
                    t.type === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </td>
                {role === "Admin" && (
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-400 hover:text-red-600 transition">
                      <Trash2 size={18} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {filteredData.length === 0 && (
          <div className="p-10 text-center text-gray-400 italic">
            No transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;
