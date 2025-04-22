import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CryptoPrices from './CryptoPrices';
import CoinDetails from './CoinDetails';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CryptoPrices />} />
        <Route path="/coin/:id" element={<CoinDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
