import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CoinDetails.css';
import axios from 'axios';

function CoinDetails() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        setCoin(res.data);
      } catch (error) {
        console.error('Error fetching coin details:', error);
      }
    };

    fetchCoin();
  }, [id]);

  if (!coin) return <p className="p-4">Loading coin details...</p>;

  return (
    <div className="coin-container max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{coin.name} ({coin.symbol.toUpperCase()})</h1>
      <img src={coin.image.large} alt={coin.name} className="coin-img w-20 h-20" />
      <p><strong>Current Price:</strong> ${coin.market_data.current_price.usd.toLocaleString()}</p>
      <p><strong>Market Cap:</strong> ${coin.market_data.market_cap.usd.toLocaleString()}</p>
      <p><strong>Total Volume:</strong> ${coin.market_data.total_volume.usd.toLocaleString()}</p>
      <p className="mt-4 text-sm text-gray-700">{coin.description.en.split('. ')[0]}.</p>
    </div>
  );
}

export default CoinDetails;
