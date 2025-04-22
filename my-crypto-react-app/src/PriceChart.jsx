import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);
function PriceChart({ coinId }) {
  const [prices, setPrices] = useState([]);
  const [timestamps, setTimestamps] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`,
          {
            params: {
              vs_currency: 'usd',
              days: 7,
            },
          }
        );
  
        const priceData = res.data.prices;
        const timeLabels = priceData.map((point) =>
          new Date(point[0]).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          })
        );
        const pricePoints = priceData.map((point) => point[1]);
  
        setTimestamps(timeLabels);
        setPrices(pricePoints);
      } catch (err) {
        console.error('Error fetching chart data:', err);
      }
    };
  
    fetchChartData();
  }, [coinId]);
  

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4">7-Day Price Chart</h2>
      <Line
        data={{
          labels: timestamps,
          datasets: [
            {
              label: 'Price (USD)',
              data: prices,
              borderColor: 'blue',
              fill: false,
              tension: 0.3,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { mode: 'index', intersect: false },
          },
          scales: {
            y: {
              ticks: { callback: (val) => `$${val.toLocaleString()}` },
            },
          },
        }}
      />
    </div>
  );
}

export default PriceChart;
