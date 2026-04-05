import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import AddTransactionForm from "../features/admin/AddTransactionForm";
import SummaryCards from "../features/dashboard/SummaryCards";
import TrendsChart from "../features/dashboard/TrendsChart";
import TransactionTable from "../features/transactions/TransactionTable";
import SpendingPieChart from "../features/dashboard/SpendingPieChart";
import Insights from "../features/dashboard/Insights";

const Dashboard = () => {
  const { role } = useContext(AppContext);

  return (
    // Mobile par p-4, Tablet/Desktop par p-8
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
            Financial Overview
          </h1>
          <p className="text-xs md:text-sm text-gray-500 font-medium">
            Track your daily income and expenses
          </p>
        </div>

        {/* Role Badge for visibility (Optional) */}
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider w-fit">
          Mode: {role}
        </div>
      </div>

      {/* 1. Statistics Cards (SummaryCards already has internal responsive grid) */}
      <SummaryCards />

      {/* 2. Charts Section: Mobile=1 col, LG=2 cols */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Har chart component ke andar ResponsiveContainer hona zaroori hai */}
        <div className="w-full min-h-[350px] md:min-h-[450px]">
          <TrendsChart />
        </div>
        <div className="w-full min-h-[350px] md:min-h-[450px]">
          <SpendingPieChart />
        </div>
      </div>

      {/* 3. Insights: Responsive padding internally handled */}
      <Insights />

      {/* 4. Admin Only Form */}
      {role === "admin" && (
        <div className="w-full">
          <AddTransactionForm />
        </div>
      )}

      {/* 5. Transactions Table: Table typically needs overflow-x-auto wrapper */}
      <div className="w-full overflow-hidden">
        <TransactionTable />
      </div>
    </div>
  );
};

export default Dashboard;
