const express = require('express');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const cors = require('cors');
require('dotenv').config();

console.log("\uD83D\uDD10 Loaded API Key:", process.env.OPENROUTER_API_KEY ? "✅ Present" : "❌ Missing");

const app = express();
app.use(express.json());
app.use(cors());

const knownWhitepapers = {
  solana: 'https://solana.com/solana-whitepaper.pdf',
  cardano: 'https://docs.cardano.org/whitepaper/',
  avalanche: 'https://assets.website-files.com/5f7f2c9382c6089019839abb/60adf0b381501167a6e76c58_Avalanche-Consensus-Whitepaper.pdf',
  arbitrum: 'https://offchain.medium.com/arbitrum-whitepaper-9f8388e00b0a',
  polkadot: 'https://polkadot.network/Polkadot-whitepaper.pdf',
  ethereum: 'https://blockchainlab.com/pdf/Ethereum_white_paper-a_next_generation_smart_contract_and_decentralized_application_platform-vitalik-buterin.pdf',
  tether: 'https://assets.ctfassets.net/vyse88cgwfbl/5UWgHMvz071t2Cq5yTw5vi/c9798ea8db99311bf90ebe0810938b01/TetherWhitePaper.pdf',
};

app.post('/analyze-whitepaper', async (req, res) => {
  const { coinId } = req.body;

  try {
    const cgRes = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}`);
    const coinData = cgRes.data;
    const coinWhitepaper = coinData.links?.whitepaper;

    const fallback = knownWhitepapers[coinId.toLowerCase()];
    const finalUrl =
      (!coinWhitepaper || !coinWhitepaper.endsWith('.pdf')) && fallback ? fallback : coinWhitepaper;

    if (!finalUrl || !finalUrl.endsWith('.pdf')) {
      return res.json({ analysis: '⚠️ No valid PDF whitepaper available for this coin.' });
    }

    const pdfRes = await axios.get(finalUrl, { responseType: 'arraybuffer' });
    const pdfData = await pdfParse(pdfRes.data);
    const text = pdfData.text.slice(0, 4000);

    const aiRes = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct',
        messages: [{
          role: 'user',
          content: `Analyze this whitepaper text. Is it trustworthy, vague, or buzzword-heavy? Summarize:\n\n${text}`
        }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'Crypto Validator',
        }
      }
    );

    res.json({ analysis: aiRes.data.choices[0].message.content });
  } catch (err) {
    console.error('❌ Backend error:', err.message);
    res.status(500).json({ error: 'Failed to analyze whitepaper.' });
  }
});

app.listen(5001, () => {
  console.log('🧠 Backend server running at http://localhost:5001');
});