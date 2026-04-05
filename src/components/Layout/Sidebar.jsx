import React from "react";
import {
  LayoutDashboard,
  ReceiptText,
  PieChart,
  Settings,
  LogOut,
  X,
  CreditCard,
} from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, active: true },
    { name: "Transactions", icon: <ReceiptText size={20} />, active: false },
    { name: "Insights", icon: <PieChart size={20} />, active: false },
    { name: "Settings", icon: <Settings size={20} />, active: false },
  ];

  return (
    <>
      {/* --- MOBILE OVERLAY --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- SIDEBAR CONTAINER --- */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:h-screen
      `}>
        {/* Brand Logo - Zorvyn Branding */}
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <CreditCard className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black tracking-tighter text-gray-900">
              Zorvyn<span className="text-indigo-600">.</span>
            </h1>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* User Profile Mini-Card (Thoughtful Touch) */}
        <div className="px-6 mb-8">
          <div className="bg-gray-50 p-4 rounded-[24px] border border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">
              NC
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">
                Nishant Choudhary
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Premium User
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group ${
                item.active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                  : "text-gray-500 hover:bg-gray-50 hover:text-indigo-600"
              }`}>
              <span
                className={
                  item.active
                    ? "text-white"
                    : "text-gray-400 group-hover:text-indigo-600"
                }>
                {item.icon}
              </span>
              <span className="font-bold text-sm tracking-tight">
                {item.name}
              </span>
            </button>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-6 mt-auto">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-100 rounded-2xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 transition-all font-bold text-sm">
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
          <p className="text-[10px] text-center text-gray-300 mt-6 font-medium">
            © 2026 Zorvyn FinTech v1.0
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
