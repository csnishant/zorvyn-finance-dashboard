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
  // ================== THEME ==================
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("app_theme") || "light";
  });

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("app_theme", theme);
  }, [theme]);

  // ================== DATA ==================
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem("app_transactions");
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("app_role") || "admin";
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

  // ================== PERSIST ==================
  useEffect(() => {
    localStorage.setItem("app_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("app_role", role);
  }, [role]);

  // ================== FILTER ==================
  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      const diffDays = (now - tDate) / (1000 * 60 * 60 * 24);

      let matchesTime = true;
      if (timeRange === "24H") matchesTime = diffDays <= 1 && diffDays >= 0;
      else if (timeRange === "7D") matchesTime = diffDays <= 7;
      else if (timeRange === "1M") matchesTime = diffDays <= 30;
      else if (timeRange === "1Y") matchesTime = diffDays <= 365;

      const matchesSearch = t.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesTime && matchesSearch;
    });
  }, [transactions, timeRange, searchTerm]);

  // ================== ACTIONS ==================
  const addTransaction = useCallback((newTx) => {
    const tx = { ...newTx, id: `tx-${Date.now()}` };
    setTransactions((prev) => [tx, ...prev]);
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

  // ================== CONTEXT VALUE ==================
  const value = useMemo(
    () => ({
      // THEME
      theme,
      toggleTheme,

      // DATA
      transactions: filteredTransactions,
      allTransactions: transactions,
      role,
      currentView,
      timeRange,
      searchTerm,
      filterType,
      sortBy,
      sortOrder,
      notifications,
      isSidebarOpen,

      // SETTERS
      setRole,
      setCurrentView,
      setTimeRange,
      setSearchTerm,
      setFilterType,
      setSortBy,
      setSortOrder,
      setNotifications,
      setIsSidebarOpen,

      // ACTIONS
      addTransaction,
      updateTransaction,
      deleteTransaction,
      clearNotifications,
    }),
    [
      theme,
      toggleTheme,
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
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
