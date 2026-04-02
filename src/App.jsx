import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";

function App() {
  const { role, setRole } = useContext(AppContext);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-sm text-gray-500 font-medium italic">
              Welcome back!
            </h2>
            <p className="font-bold text-gray-800">Finance Control Center</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 flex items-center gap-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Role:
              </span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-sm font-bold text-blue-800 outline-none cursor-pointer">
                <option value="Admin">Admin (Edit Mode)</option>
                <option value="Viewer">Viewer (View Only)</option>
              </select>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
