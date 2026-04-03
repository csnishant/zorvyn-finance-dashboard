import Sidebar from "./components/Layout/Sidebar";

import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Layout/Navbar";

function App() {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Top Header */}
        <Navbar />

        {/* Dashboard Content */}
        <main className="p-8">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
