import React, { useContext } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { AppContext } from "../../context/AppContext";

const Layout = ({ children }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useContext(AppContext);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* --- SIDEBAR --- */}
      {/* Context ki state yahan pass ho rahi hai */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* --- MAIN AREA --- */}
      <div
        className={`flex flex-col flex-1 min-w-0 transition-all duration-300 ${isSidebarOpen ? "lg:pl-72" : "lg:pl-72"}`}>
        {/* --- NAVBAR --- */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
          <Navbar />
        </header>

        {/* --- DYNAMIC CONTENT --- */}
        <main className="flex-1 p-4 md:p-8 lg:p-10 w-full overflow-x-hidden">
          <div className="max-w-[1600px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
