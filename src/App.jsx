import React, { useState } from 'react';
import Papa from 'papaparse';
import axios from 'axios';
import { url } from './constant';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './Home';
import CorrectedSpell from './CorrectedSpell';

const App = () => {
  const [correctedText, setCorrectedText] = useState("");
 
return(
  <div className="App">
    <Link to="/" element={<Home />}></Link>
    <Link to="/corrections" element={<CorrectedSpell correctedText={correctedText} />}></Link>

    <Routes>
        <Route path="/" element={<Home setCorrectedText={setCorrectedText} />} />
        <Route path="/corrections" element={<CorrectedSpell correctedText={correctedText} />} />
      </Routes>
  </div>
)
};

export default App;
