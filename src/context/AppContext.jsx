import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { initialTransactions } from "../data/mockData";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("app_transactions");
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch (e) {
      console.error("Restore Failed:", e);
      return initialTransactions;
    }
  });

  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem("app_role") || "admin";
    } catch {
      return "admin";
    }
  });

  const [currentView, setCurrentView] = useState("Dashboard");
  const [timeRange, setTimeRange] = useState("1M");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome",
      message: "Your finance dashboard is ready 🚀",
      type: "success",
      time: "now",
      unread: true,
    },
  ]);

  // ✅ PERSIST DATA
  useEffect(() => {
    localStorage.setItem("app_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("app_role", role);
  }, [role]);

  // 🔥 GLOBAL FILTER LOGIC (Ab ye logic yahan centrally chalega)
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const diffTime = now - tDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      // Filtering by Time Range
      let matchesTime = true;
      if (timeRange === "24H") matchesTime = diffDays <= 1 && diffDays >= 0;
      else if (timeRange === "7D") matchesTime = diffDays <= 7 && diffDays >= 0;
      else if (timeRange === "1M")
        matchesTime = diffDays <= 30 && diffDays >= 0;
      else if (timeRange === "1Y")
        matchesTime = diffDays <= 365 && diffDays >= 0;

      // Filtering by Search Term
      const matchesSearch = t.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesTime && matchesSearch;
    });
  }, [transactions, timeRange, searchTerm]);

  // 🔥 ACTIONS
  const addTransaction = useCallback((newTx) => {
    const tx = { ...newTx, id: `tx-${Date.now()}` };
    setTransactions((prev) => [tx, ...prev]);
    // Notification logic...
  }, []);

  const updateTransaction = useCallback((updatedTx) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx)),
    );
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }, []);

  const handleSetRole = useCallback((newRole) => {
    setRole(newRole);
  }, []);

  // ✅ OPTIMIZED CONTEXT VALUE
  const value = useMemo(
    () => ({
      // Data
      transactions: filteredTransactions, // 👈 Ab components ko filtered data hi milega
      allTransactions: transactions, // 👈 Backup ke liye agar kabhi saara data chahiye ho
      role,
      currentView,
      timeRange,
      searchTerm,
      filterType,
      sortBy,
      sortOrder,
      notifications,
      isSidebarOpen,

      // Setters
      setRole: handleSetRole,
      setCurrentView,
      setTimeRange,
      setSearchTerm,
      setFilterType,
      setSortBy,
      setSortOrder,
      setNotifications,
      setIsSidebarOpen,

      // Actions
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearNotifications,
    }),
    [
      filteredTransactions,
      transactions,
      role,
      currentView,
      timeRange,
      searchTerm,
      filterType,
      sortBy,
      sortOrder,
      notifications,
      isSidebarOpen,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearNotifications,
      handleSetRole,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
