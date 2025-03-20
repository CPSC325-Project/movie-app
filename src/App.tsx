import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RateMovies } from './pages/RateMovies';
import { About } from './pages/About';
import { HowToUse } from './pages/HowToUse';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-40 md:hidden bg-purple-900 text-white p-2 rounded-md shadow-lg"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rate-movies" element={<RateMovies />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;