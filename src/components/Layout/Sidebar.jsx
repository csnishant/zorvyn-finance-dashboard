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
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar aside */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
              <CreditCard className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tighter">
              Zorvyn<span className="text-indigo-600">.</span>
            </h1>
          </div>
          {/* Close for Mobile */}
          <button
            className="lg:hidden p-2 text-gray-400"
            onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>

          {/* Collapse Button for Desktop (Sidebar ke andar) */}
          <button
            className="hidden lg:flex p-1.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors"
            onClick={() => setIsSidebarOpen(false)}>
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* User Profile... (Nishant Choudhary wala card yahan rahega) */}

        <nav className="flex-1 px-4 py-4 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() =>
                window.innerWidth < 1024 && setIsSidebarOpen(false)
              }
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 ${isActive ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"}`
              }>
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom Section... (Sign out button) */}
      </aside>

      {/* Jab Sidebar closed ho, tab bahar ek button dikhega Sidebar kholne ke liye (Desktop par) */}
      {!isSidebarOpen && (
        <button
          className="hidden lg:flex fixed top-5 left-5 z-50 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-600 hover:text-indigo-600"
          onClick={() => setIsSidebarOpen(true)}>
          <Menu size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;
