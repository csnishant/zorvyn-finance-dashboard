// src/App.jsx
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

function App() {
  const { role, setRole } = useContext(AppContext);

  return (
    <div className="p-10 font-sans">
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <h1 className="text-xl font-bold">Finance Dash</h1>

        {/* Role Switcher: Yahi aapka "Login" simulation hai */}
        <div className="flex items-center gap-2">
          <span>Current Role:</span>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-1 rounded bg-white">
            <option value="Admin">Admin</option>
            <option value="Viewer">Viewer</option>
          </select>
        </div>
      </div>

      <div className="mt-10 p-6 border-2 border-dashed border-gray-300 rounded-xl">
        <h2 className="text-lg mb-4">Transaction Control Panel</h2>

        {/* Yaha check ho raha hai role */}
        {role === "Admin" ? (
          <div className="bg-green-100 p-4 rounded border border-green-300">
            <p className="text-green-700 font-bold mb-2">Role: Admin Access</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              + Add New Transaction
            </button>
          </div>
        ) : (
          <div className="bg-yellow-100 p-4 rounded border border-yellow-300">
            <p className="text-yellow-700">
              Role: <strong>Viewer</strong> (Read Only)
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Aapko button nahi dikhega kyunki aap Admin nahi hain.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
