import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './Home';
import CorrectedSpell from './CorrectedSpell';
import RuleEditor from './pages/RuleEditor';

const App = () => {
  const [correctedText, setCorrectedText] = useState("");

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">📊 Data Ingestion Platform</h1>
          <div className="space-x-4">
            <Link to="/">
              <button className="text-gray-700 hover:text-blue-600 font-medium">Home</button>
            </Link>
            <Link to="/corrections">
              <button className="text-gray-700 hover:text-blue-600 font-medium">Corrections</button>
            </Link>
            <Link to="/rule-editor">
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition">
                🧩 Rule Builder
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="p-6 max-w-7xl mx-auto">
        <Routes>
          <Route path="/" element={<Home setCorrectedText={setCorrectedText} />} />
          <Route path="/corrections" element={<CorrectedSpell correctedText={correctedText} />} />
          <Route path="/rule-editor" element={<RuleEditor />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-4 mt-10 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} Data Platform | Built with ❤️ by You
      </footer>
    </div>
  );
};

export default App;
