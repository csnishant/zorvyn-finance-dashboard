import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import AddTransactionForm from "../features/admin/AddTransactionForm";
import SummaryCards from "../features/dashboard/SummaryCards";
import TrendsChart from "../features/dashboard/TrendsChart";
import TransactionTable from "../features/transactions/TransactionTable";
import SpendingPieChart from "../features/dashboard/SpendingPieChart";

const Dashboard = () => {
  const { role } = useContext(AppContext);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Financial Overview
      </h1>

      {/* 1. Statistics Cards */}
      <SummaryCards />

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendsChart />
        <SpendingPieChart />
      </div>

      {/* 3. Admin Only: Add Transaction Form */}
      {role === "admin" && (
        <div className="mt-6">
          <AddTransactionForm />
        </div>
      )}

      {/* 4. Transactions Table */}
      <TransactionTable />
    </div>
  );
};
export default Dashboard;
