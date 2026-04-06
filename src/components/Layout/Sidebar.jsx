import React from "react";
import { NavLink } from "react-router-dom";
import { useFinance } from "../../hooks/useFinance";
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Settings,
  LogOut,
  X,
  CreditCard,
  ChevronLeft,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useFinance();

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, path: "/" },
    {
      name: "Transactions",
      icon: <ReceiptText size={20} />,
      path: "/transactions",
    },
    { name: "Insights", icon: <PieChart size={20} />, path: "/insights" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
  ];

  return (
    <>
      {/* Mobile overlay - Dark mode friendly backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar aside - Added dark:bg-slate-900 and dark:border-slate-800 */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20">
              <CreditCard className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
              Zorvyn<span className="text-indigo-600">.</span>
            </h1>
          </div>

          {/* Close for Mobile */}
          <button
            className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
            onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>

          {/* Collapse Button for Desktop */}
          <button
            className="hidden lg:flex p-1.5 bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Navigation - Added dark mode link states */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() =>
                window.innerWidth < 1024 && setIsSidebarOpen(false)
              }
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100 dark:shadow-indigo-900/40 scale-[1.02]"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
                }`
              }>
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section - Sign Out */}
        <div className="p-4 border-t border-gray-100 dark:border-slate-800">
          <button className="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Floating Toggle Button when closed */}
      {!isSidebarOpen && (
        <button
          className="hidden lg:flex fixed top-5 left-5 z-50 p-3 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm dark:shadow-xl text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all active:scale-90"
          onClick={() => setIsSidebarOpen(true)}>
          <Menu size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
