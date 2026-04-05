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
  // ✅ Transactions (with localStorage restore)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("app_transactions");
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch (e) {
      console.error("Restore Failed:", e);
      return initialTransactions;
    }
  });

  // ✅ Role (persisted)
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem("app_role") || "admin";
    } catch {
      return "admin";
    }
  });

  // ✅ UI States
  const [currentView, setCurrentView] = useState("Dashboard");
  const [timeRange, setTimeRange] = useState("1M");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ Notifications
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

  // ✅ Persist data
  useEffect(() => {
    localStorage.setItem("app_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("app_role", role);
  }, [role]);

  // 🔥 ACTIONS

  const addTransaction = useCallback((newTx) => {
    const tx = { ...newTx, id: `tx-${Date.now()}` };

    setTransactions((prev) => [tx, ...prev]);

    setNotifications((prev) => [
      {
        id: Date.now(),
        title: "Transaction Added",
        message: `${tx.type} of ₹${tx.amount}`,
        type: "success",
        time: "Just now",
        unread: true,
      },
      ...prev,
    ]);
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

  // ✅ Optimized Context Value
  const value = useMemo(
    () => ({
      // data
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

      // setters
      setRole: handleSetRole,
      setCurrentView,
      setTimeRange,
      setSearchTerm,
      setFilterType,
      setSortBy,
      setSortOrder,
      setNotifications,
      setIsSidebarOpen,

      // actions
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearNotifications,
    }),
    [
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
