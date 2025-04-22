import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import PriceChart from './PriceChart';
import WhitepaperLLM from './WhitepaperLLM';
import './CoinDetails.css';


function CoinDetails() {
  const { id } = useParams();
  const [coin, setCoin] = useState(null);
  const [whitepaperText, setWhitepaperText] = useState('');
  console.log("🔄 Fetching coin data for ID:", id);


  useEffect(() => {
    const fetchCoin = async () => {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`);
        console.log("✅ Coin data received:", res.data);
        setCoin(res.data);
      } catch (error) {
        console.error("❌ Error fetching coin:", error.message);
      }
    };

    fetchCoin();
  }, [id]);
  

//   useEffect(() => {
//     const extractWhitepaper = async () => {
//       const knownWhitepapers = {
//         solana: 'https://solana.com/solana-whitepaper.pdf',
//         cardano: 'https://docs.cardano.org/whitepaper/',
//         avalanche: 'https://assets.website-files.com/5f7f2c9382c6089019839abb/60adf0b381501167a6e76c58_Avalanche-Consensus-Whitepaper.pdf',
//         arbitrum: 'https://offchain.medium.com/arbitrum-whitepaper-9f8388e00b0a',
//         polkadot: 'https://polkadot.network/Polkadot-whitepaper.pdf',
//         ethereum: 'https://blockchainlab.com/pdf/Ethereum_white_paper-a_next_generation_smart_contract_and_decentralized_application_platform-vitalik-buterin.pdf',
//         tether: 'https://assets.ctfassets.net/vyse88cgwfbl/5UWgHMvz071t2Cq5yTw5vi/c9798ea8db99311bf90ebe0810938b01/TetherWhitePaper.pdf',
//       };
  
//       const whitepaperLink = coin?.links?.whitepaper;
//       const fallbackWhitepaper = knownWhitepapers[id];
//       const displayWhitepaperLink =
//         (!whitepaperLink || !whitepaperLink.endsWith('.pdf')) && fallbackWhitepaper
//           ? fallbackWhitepaper
//           : whitepaperLink;
  
//       if (!displayWhitepaperLink || !displayWhitepaperLink.endsWith('.pdf')) {
//         console.warn(`⚠️ Skipping whitepaper: no valid PDF for ${id}`);
//         return;
//       }
  
//       try {
//         const extractRes = await axios.post('http://localhost:5001/extract-whitepaper', {
//           whitepaperUrl: displayWhitepaperLink,
//         });
//         setWhitepaperText(extractRes.data.text);
//       } catch (err) {
//         console.error('❌ Whitepaper extraction failed:', err.message);
//       }
//     };
  
//     if (coin) extractWhitepaper();
//   }, [coin, id]);
  
  



//   // Compute Liquidity Ratio
//   const liquidityRatio = marketData
//     ? marketData.total_volume.usd / marketData.market_cap.usd
//     : null;

//   const twitterFollowers = coin.community_data?.twitter_followers;
//   const redditPosts = coin.community_data?.reddit_average_posts_48h;
    
  
//   // Developer Heuristics
//   const forks = coin.developer_data?.forks;
//   const stars = coin.developer_data?.stars;
  
//   // Whitepaper + Homepage
//   const whitepaperLink = coin.links?.whitepaper;
//   const homepage = coin.links?.homepage?.[0];
  
//   // Price Change
//   const priceChange24h = marketData?.price_change_percentage_24h;


//   const fallbackWhitepaper = knownWhitepapers[coin.id];
//   const displayWhitepaperLink = whitepaperLink || fallbackWhitepaper;

  if (!coin) return <p>Loading...</p>;
  const marketData = coin.market_data;
  const description = coin.description?.en || '';
  const liquidityRatio = marketData
  ? marketData.total_volume.usd / marketData.market_cap.usd
  : null;

  const twitterFollowers = coin.community_data?.twitter_followers;
  const redditPosts = coin.community_data?.reddit_average_posts_48h;
    
  
  // Developer Heuristics
  const forks = coin.developer_data?.forks;
  const stars = coin.developer_data?.stars;
  
  // Whitepaper + Homepage
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
    tether: 'https://assets.ctfassets.net/vyse88cgwfbl/5UWgHMvz071t2Cq5yTw5vi/c9798ea8db99311bf90ebe0810938b01/TetherWhitePaper.pdf',
  };
  
  const whitepaperLink = coin.links?.whitepaper;
  const fallbackWhitepaper = knownWhitepapers[id];
  const displayWhitepaperLink =
    (!whitepaperLink || !whitepaperLink.endsWith('.pdf')) && fallbackWhitepaper
      ? fallbackWhitepaper
      : whitepaperLink;


  
  return (
    <div className="coin-container w-full max-w-7xl mx-auto px-4">
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

        {displayWhitepaperLink && (
        <p className="mt-4">
            <strong>Whitepaper:</strong>{' '}
            <a href={displayWhitepaperLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            View PDF
            </a>
        </p>
        )}

        
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
        <div className="mt-10 border-t pt-6">
            <PriceChart coinId={id} />
        </div>
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-2">🤖 LLM Analysis of Whitepaper</h2>
        <WhitepaperLLM coin={coin} id={id} />
      </div>



    </div>
  );
}




//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold">{coin.name}</h1>
//       <p><strong>Symbol:</strong> {coin.symbol.toUpperCase()}</p>
//       <p><strong>Market Rank:</strong> {coin.market_cap_rank}</p>
//       <p><strong>Description:</strong> {coin.description?.en?.slice(0, 100)}...</p>
//       {liquidityRatio && (
//         <p>
//             <strong>Liquidity Ratio:</strong> {liquidityRatio.toFixed(4)}
//             {liquidityRatio < 0.01 && (
//             <span className="text-red-600 ml-2 font-semibold">⚠️ Very Low</span>
//             )}
//             {liquidityRatio >= 0.01 && liquidityRatio < 0.05 && (
//             <span className="text-yellow-600 ml-2 font-semibold">⚠️ Medium</span>
//             )}
//             {liquidityRatio >= 0.05 && (
//             <span className="text-green-600 ml-2 font-semibold">✅ Healthy</span>
//             )}
//         </p>
//     )}
  
//       {/* ✅ LLM whitepaper section */}
//       {whitepaperText && (
//         <div className="mt-10 border-t pt-6">
//           <h2 className="text-xl font-bold mb-2">🤖 LLM Analysis of Whitepaper</h2>
//           <WhitepaperLLM whitepaperText={whitepaperText} />
//         </div>
//       )}
//     </div>
//   );
  
// }

export default CoinDetails;







//   const marketData = coin.market_data;
//   const description = coin.description?.en || '';

//   // Compute Liquidity Ratio
//   const liquidityRatio = marketData
//     ? marketData.total_volume.usd / marketData.market_cap.usd
//     : null;


  
  
  



//   return (
//     <div className="coin-container w-full max-w-7xl mx-auto px-4">
//       <h1 className="text-3xl font-bold mb-4">
//         {coin.name} ({coin.symbol?.toUpperCase()})
//       </h1>

//       {coin.image?.large && (
//         <img src={coin.image.large} alt={coin.name} className="coin-img w-20 h-20" />
//       )}

//       {marketData && (
//         <>
//           <p><strong>Current Price:</strong> ${marketData.current_price.usd.toLocaleString()}</p>
//           <p><strong>Market Cap:</strong> ${marketData.market_cap.usd.toLocaleString()}</p>
//           <p><strong>Total Volume:</strong> ${marketData.total_volume.usd.toLocaleString()}</p>
//           {description && (
//         <p className="mt-6 text-sm text-gray-700">{description.split('. ')[0]}.</p>
//             )}
//         </>
//       )}

//         <hr className="my-6" />
//         <h2 className="text-xl font-bold mb-2">🛡️ Safety Checks</h2>

//         {/* Liquidity Ratio */}
        // {liquidityRatio && (
        // <p>
        //     <strong>Liquidity Ratio:</strong> {liquidityRatio.toFixed(4)}
        //     {liquidityRatio < 0.01 && (
        //     <span className="text-red-600 ml-2 font-semibold">⚠️ Very Low</span>
        //     )}
        //     {liquidityRatio >= 0.01 && liquidityRatio < 0.05 && (
        //     <span className="text-yellow-600 ml-2 font-semibold">⚠️ Medium</span>
        //     )}
        //     {liquidityRatio >= 0.05 && (
        //     <span className="text-green-600 ml-2 font-semibold">✅ Healthy</span>
        //     )}
        // </p>
        // )}

//         {/* Community Activity */}
//         {typeof twitterFollowers === 'number' && (
//         <p>
//             <strong>Twitter Followers:</strong> {twitterFollowers.toLocaleString()}
//             {twitterFollowers < 10000 ? (
//             <span className="text-yellow-600 ml-2 font-semibold">⚠️ Low</span>
//             ) : (
//             <span className="text-green-600 ml-2 font-semibold">✅ Strong Presence</span>
//             )}
//         </p>
//         )}

//         {/* Developer Signals */}
//         {typeof forks === 'number' && typeof stars === 'number' && (
//         <p>
//             <strong>GitHub Forks:</strong> {forks.toLocaleString()} | <strong>Stars:</strong> {stars.toLocaleString()}
//             {(forks < 10 || stars < 10) ? (
//             <span className="text-yellow-600 ml-2 font-semibold">⚠️ Low Engagement</span>
//             ) : (
//             <span className="text-green-600 ml-2 font-semibold">✅ Good Developer Support</span>
//             )}
//         </p>
//         )}

//         {/* Whitepaper */}
//         <p>
//             <strong>Whitepaper:</strong>{' '}
//             {displayWhitepaperLink ? (
//                 <a href={displayWhitepaperLink} className="text-blue-600 underline" target="_blank" rel="noreferrer">View</a>
//             ) : (
//                 <span className="text-red-600 font-semibold">❌ Not Available</span>
//             )}
//         </p>

//         {/* Homepage */}
//         <p>
//         <strong>Homepage:</strong>{' '}
//         {homepage ? (
//             <>
//             <a href={homepage} className="text-blue-600 underline" target="_blank" rel="noreferrer">{homepage}</a>
//             {homepage.includes("linktr.ee") && (
//                 <span className="text-yellow-600 ml-2 font-semibold">⚠️ Linktree Only</span>
//             )}
//             </>
//         ) : (
//             <span className="text-red-600 font-semibold">❌ Not Provided</span>
//         )}
//         </p>

//         {/* Price Volatility */}
//         {priceChange24h !== undefined && (
//         <p>
//             <strong>24h Price Change:</strong> {priceChange24h.toFixed(2)}%
//             {priceChange24h > 500 ? (
//             <span className="text-red-600 ml-2 font-semibold">⚠️ Extreme Volatility</span>
//             ) : (
//             <span className="text-green-600 ml-2 font-semibold">✅ Stable</span>
//             )}
//         </p>
//         )}
//         <div className="mt-10 border-t pt-6">
//             <PriceChart coinId={id} />
//         </div>
    //   {/* ✅ LLM whitepaper section */}
    //   {whitepaperText && (
    //     <div className="mt-10 border-t pt-6">
    //       <h2 className="text-xl font-bold mb-2">🤖 LLM Analysis of Whitepaper</h2>
    //       <WhitepaperLLM whitepaperText={whitepaperText} />
    //     </div>
    //   )}



//     </div>
//   );
// }

// export default CoinDetails;