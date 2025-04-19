import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CryptoPrices() {
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 10,
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

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Top 10 Cryptocurrencies</h2>
      <ul>
        {coins.map((coin) => (
          <li key={coin.id} className="mb-2">
            <strong>{coin.name} ({coin.symbol.toUpperCase()}):</strong> ${coin.current_price.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CryptoPrices;
