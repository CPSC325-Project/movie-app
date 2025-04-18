import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RateMovies } from './pages/RateMovies';
import { About } from './pages/About';
import { HowToUse } from './pages/HowToUse';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { UpdatePassword } from './pages/UpdatePassword';
import { ResetPassword } from './pages/ResetPassword';

function App() {

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">

        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/rate-movies" element={<RateMovies />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-to-use" element={<HowToUse />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;