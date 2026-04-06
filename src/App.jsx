import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // 1. useLocation add kiya
import { motion, AnimatePresence } from "framer-motion"; // 2. Framer motion add kiya
import Sidebar from "./components/Layout/Sidebar";
import Navbar from "./components/Layout/Navbar";
import Dashboard from "./pages/Dashboard";
import TransactionTable from "./components/transactions/TransactionTable";
import { useFinance } from "./hooks/useFinance";
import Insights from "./components/dashboard/Insights";

function App() {
  const { isSidebarOpen, theme } = useFinance();
  const location = useLocation(); // 3. Current URL track karne ke liye

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        theme === "dark" ? "bg-slate-950 text-white" : "bg-white text-slate-900"
      }`}>
      <Sidebar />

      <div
        className={`flex flex-col flex-1 w-full transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "lg:pl-72" : "lg:pl-0"}`}>
        <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-slate-800">
          <Navbar />
        </header>

        <main className="flex-1 w-full overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto p-4 lg:p-8 min-h-screen bg-transparent">
            {/* 4. Global Animation Wrapper Start */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname} // Sabse Important: Key path par depend hai
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}>
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Dashboard />} />
                  <Route
                    path="/transactions"
                    element={
                      <div className="glass dark:bg-slate-900/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-800">
                        <TransactionTable />
                      </div>
                    }
                  />
                  <Route path="/insights" element={<Insights />} />
                </Routes>
              </motion.div>
            </AnimatePresence>
            {/* Global Animation Wrapper End */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
