import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Layout/Sidebar";
import Navbar from "./components/Layout/Navbar";
import Dashboard from "./pages/Dashboard";
import TransactionTable from "./features/transactions/TransactionTable";
import Insights from "./features/dashboard/Insights";
import { useFinance } from "./hooks/useFinance";

const Settings = () => (
  <div className="p-10 text-2xl font-bold text-gray-800">Settings Page</div>
);

function App() {
  const { isSidebarOpen } = useFinance();

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* SIDEBAR - Isse koi props dene ki zaroorat nahi kyunki ye khud hook use kar raha hai */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div
        className={`flex flex-col flex-1 w-full transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? "lg:pl-72" : "lg:pl-0"}`} // <-- Dynamic Padding
      >
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
          <Navbar />
        </header>

        <main className="flex-1 w-full overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route
                path="/transactions"
                element={
                  <div className="glass p-6 rounded-3xl">
                    <TransactionTable />
                  </div>
                }
              />
              <Route path="/insights" element={<Insights />} />
              <Route path="/settings" element={<Settings />} />
              <Route
                path="*"
                element={
                  <div className="p-10 text-center">404 - Page Not Found</div>
                }
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
