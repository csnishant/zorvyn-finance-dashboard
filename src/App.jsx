import Sidebar from "./components/Layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Layout/Navbar";

function App() {
  return (
    <div className="flex min-h-screen bg-gray-50/50">
      {/* SIDEBAR: Desktop par fixed, Mobile par hidden */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-50 border-r border-gray-100 bg-white">
        <Sidebar />
      </aside>

      {/* MAIN CONTENT Area */}
      {/* lg:pl-64 sirf badi screen par padding dega */}
      <div className="flex flex-col flex-1 lg:pl-64 w-full overflow-x-hidden">
        {/* Navbar sticky rahega aur width full lega */}
        <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
          <Navbar />
        </header>

        {/* Dashboard Content: Mobile par padding kam, Desktop par zyada */}
        <main className="flex-1 w-full overflow-x-hidden">
          <div className="max-w-[1400px] mx-auto">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
