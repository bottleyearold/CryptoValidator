import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WhitepaperLLM({ coin, id }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coin) return;

    const knownWhitepapers = {
      solana: 'https://solana.com/solana-whitepaper.pdf',
      cardano: 'https://docs.cardano.org/whitepaper/',
      avalanche: 'https://assets.website-files.com/5f7f2c9382c6089019839abb/60adf0b381501167a6e76c58_Avalanche-Consensus-Whitepaper.pdf',
      arbitrum: 'https://offchain.medium.com/arbitrum-whitepaper-9f8388e00b0a',
      polkadot: 'https://polkadot.network/Polkadot-whitepaper.pdf',
      ethereum: 'https://blockchainlab.com/pdf/Ethereum_white_paper-a_next_generation_smart_contract_and_decentralized_application_platform-vitalik-buterin.pdf',
      tether: 'https://assets.ctfassets.net/vyse88cgwfbl/5UWgHMvz071t2Cq5yTw5vi/c9798ea8db99311bf90ebe0810938b01/TetherWhitePaper.pdf',
    };

    const whitepaperLink = coin?.links?.whitepaper;
    const fallback = knownWhitepapers[id.toLowerCase()];
    const finalWhitepaper =
      (!whitepaperLink || !whitepaperLink.endsWith('.pdf')) && fallback
        ? fallback
        : whitepaperLink;

    if (!finalWhitepaper || !finalWhitepaper.endsWith('.pdf')) {
      setAnalysis('⚠️ No valid PDF whitepaper found for this coin.');
      return;
    }

    const fetchAndAnalyze = async () => {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:5001/extract-whitepaper', {
          whitepaperUrl: finalWhitepaper,
        });

        const text = res.data.text;

        const aiRes = await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          {
            model: 'mistralai/mistral-7b-instruct',
            messages: [
              {
                role: 'user',
                content: `Analyze this whitepaper text. Is it trustworthy, vague, or buzzword-heavy? Summarize:\n\n${text}`,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:5173',
              'X-Title': 'Crypto Validator',
            },
          }
        );

        const content = aiRes.data.choices[0].message.content;
        setAnalysis(content);
      } catch (err) {
        console.error('❌ Failed LLM or PDF step:', err.message);
        setAnalysis('❌ Failed to extract or analyze whitepaper.');
      } finally {
        setLoading(false);
      }
    };

    fetchAndAnalyze();
  }, [coin, id]);

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap text-sm">
      {loading ? '🔍 Analyzing whitepaper...' : analysis}
    </div>
  );
}

export default WhitepaperLLM;
