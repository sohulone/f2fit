import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useState } from 'react';
import WellnessForm from './views/WellnessForm';
import Dashboard from './views/Dashboard';
import OnlineStatusIndicator from './components/OnlineStatusIndicator';
import { setAuthUser, getAuthUser } from './services/api';

function App() {
  const [currentUser, setCurrentUser] = useState(getAuthUser());

  const handleUserChange = (e) => {
    const newUser = e.target.value;
    setCurrentUser(newUser);
    setAuthUser(newUser);
  };

  return (
    <Router>
      <div className="min-h-screen">
        {/* Indicador de estado de conexión */}
        <OnlineStatusIndicator />
        
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-pink-700">🍎 F2Fit</h1>
              
              {/* Selector de Usuario */}
              <div className="flex items-center gap-4">
                <label className="text-sm text-gray-600">Usuario:</label>
                <select
                  value={currentUser}
                  onChange={handleUserChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="user1">Usuario 1</option>
                  <option value="user2">Usuario 2</option>
                  <option value="user3">Usuario 3</option>
                </select>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="mt-4">
              <ul className="flex gap-6">
                <li>
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Registrar
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<WellnessForm currentUser={currentUser} />} />
            <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white mt-12 py-6 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
            F2Fit Wellness Tracker © 2026
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
