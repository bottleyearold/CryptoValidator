import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
//Looks good currently
function CryptoPrices() {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );
        setCoins(res.data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchPrices();
  }, []);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">
        💰 Top Cryptocurrencies
      </h2>

      <input
        type="text"
        placeholder="🔍 Search by name or symbol..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-lg p-3 w-full mb-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredCoins.map((coin) => (
          <li key={coin.id} className="border rounded-xl p-4 shadow hover:shadow-md transition bg-white">
            <Link to={`/coin/${coin.id}`} className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{coin.name} ({coin.symbol.toUpperCase()})</h3>
                <p className="text-sm text-gray-600">${coin.current_price.toLocaleString()}</p>
              </div>
              <img src={coin.image} alt={coin.name} className="w-10 h-10" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default CryptoPrices;
