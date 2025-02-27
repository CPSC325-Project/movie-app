import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Welcome } from './pages/Welcome';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { RateMovies } from './pages/RateMovies';
import { About } from './pages/About';
import { HowToUse } from './pages/HowToUse';
import { Recommend } from './pages/Recommed';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/rate-movies" element={<RateMovies />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/recommend" element={<Recommend />} />
      </Routes>
    </Router>
  );
}

export default App;