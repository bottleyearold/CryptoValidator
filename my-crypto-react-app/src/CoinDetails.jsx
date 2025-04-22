import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CoinDetails.css';
import axios from 'axios';
import PriceChart from './PriceChart';

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

  const marketData = coin.market_data;
  const description = coin.description?.en || '';

  // Compute Liquidity Ratio
  const liquidityRatio = marketData
    ? marketData.total_volume.usd / marketData.market_cap.usd
    : null;

  const twitterFollowers = coin.community_data?.twitter_followers;
  const redditPosts = coin.community_data?.reddit_average_posts_48h;
    
  
  // Developer Heuristics
  const forks = coin.developer_data?.forks;
  const stars = coin.developer_data?.stars;
  
  // Whitepaper + Homepage
  const whitepaperLink = coin.links?.whitepaper;
  const homepage = coin.links?.homepage?.[0];
  
  // Price Change
  const priceChange24h = marketData?.price_change_percentage_24h;
  const knownWhitepapers = {
    solana: 'https://solana.com/solana-whitepaper.pdf',
    cardano: 'https://docs.cardano.org/whitepaper/',
    avalanche: 'https://assets.website-files.com/5f7f2c9382c6089019839abb/60adf0b381501167a6e76c58_Avalanche-Consensus-Whitepaper.pdf',
    arbitrum: 'https://offchain.medium.com/arbitrum-whitepaper-9f8388e00b0a',
    polkadot: 'https://polkadot.network/Polkadot-whitepaper.pdf',
    ethereum: 'https://blockchainlab.com/pdf/Ethereum_white_paper-a_next_generation_smart_contract_and_decentralized_application_platform-vitalik-buterin.pdf',
  };
  const fallbackWhitepaper = knownWhitepapers[coin.id];
  const displayWhitepaperLink = whitepaperLink || fallbackWhitepaper;


  console.log("Coin Debug:", coin);
  return (
    <div className="coin-container max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        {coin.name} ({coin.symbol?.toUpperCase()})
      </h1>

      {coin.image?.large && (
        <img src={coin.image.large} alt={coin.name} className="coin-img w-20 h-20" />
      )}

      {marketData && (
        <>
          <p><strong>Current Price:</strong> ${marketData.current_price.usd.toLocaleString()}</p>
          <p><strong>Market Cap:</strong> ${marketData.market_cap.usd.toLocaleString()}</p>
          <p><strong>Total Volume:</strong> ${marketData.total_volume.usd.toLocaleString()}</p>
          {description && (
        <p className="mt-6 text-sm text-gray-700">{description.split('. ')[0]}.</p>
            )}
        </>
      )}

        <hr className="my-6" />
        <h2 className="text-xl font-bold mb-2">🛡️ Safety Checks</h2>

        {/* Liquidity Ratio */}
        {liquidityRatio && (
        <p>
            <strong>Liquidity Ratio:</strong> {liquidityRatio.toFixed(4)}
            {liquidityRatio < 0.01 && (
            <span className="text-red-600 ml-2 font-semibold">⚠️ Very Low</span>
            )}
            {liquidityRatio >= 0.01 && liquidityRatio < 0.05 && (
            <span className="text-yellow-600 ml-2 font-semibold">⚠️ Medium</span>
            )}
            {liquidityRatio >= 0.05 && (
            <span className="text-green-600 ml-2 font-semibold">✅ Healthy</span>
            )}
        </p>
        )}

        {/* Community Activity */}
        {typeof twitterFollowers === 'number' && (
        <p>
            <strong>Twitter Followers:</strong> {twitterFollowers.toLocaleString()}
            {twitterFollowers < 10000 ? (
            <span className="text-yellow-600 ml-2 font-semibold">⚠️ Low</span>
            ) : (
            <span className="text-green-600 ml-2 font-semibold">✅ Strong Presence</span>
            )}
        </p>
        )}

        {/* Developer Signals */}
        {typeof forks === 'number' && typeof stars === 'number' && (
        <p>
            <strong>GitHub Forks:</strong> {forks.toLocaleString()} | <strong>Stars:</strong> {stars.toLocaleString()}
            {(forks < 10 || stars < 10) ? (
            <span className="text-yellow-600 ml-2 font-semibold">⚠️ Low Engagement</span>
            ) : (
            <span className="text-green-600 ml-2 font-semibold">✅ Good Developer Support</span>
            )}
        </p>
        )}

        {/* Whitepaper */}
        <p>
            <strong>Whitepaper:</strong>{' '}
            {displayWhitepaperLink ? (
                <a href={displayWhitepaperLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">View</a>
            ) : (
                <span className="text-red-600 font-semibold">❌ Not Available</span>
            )}
        </p>

        {/* Homepage */}
        <p>
        <strong>Homepage:</strong>{' '}
        {homepage ? (
            <>
            <a href={homepage} className="text-blue-600 underline" target="_blank" rel="noreferrer">{homepage}</a>
            {homepage.includes("linktr.ee") && (
                <span className="text-yellow-600 ml-2 font-semibold">⚠️ Linktree Only</span>
            )}
            </>
        ) : (
            <span className="text-red-600 font-semibold">❌ Not Provided</span>
        )}
        </p>

        {/* Price Volatility */}
        {priceChange24h !== undefined && (
        <p>
            <strong>24h Price Change:</strong> {priceChange24h.toFixed(2)}%
            {priceChange24h > 500 ? (
            <span className="text-red-600 ml-2 font-semibold">⚠️ Extreme Volatility</span>
            ) : (
            <span className="text-green-600 ml-2 font-semibold">✅ Stable</span>
            )}
        </p>
        )}

        <div>
            <PriceChart coinId={id} />
        </div>


    </div>
  );
}

export default CoinDetails;