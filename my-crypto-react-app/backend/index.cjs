const express = require('express');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/extract-whitepaper', async (req, res) => {
  const { whitepaperUrl } = req.body;

  try {
    const pdfRes = await axios.get(whitepaperUrl, { responseType: 'arraybuffer' });
    const data = await pdfParse(pdfRes.data);
    const text = data.text;
    res.json({ text: text.slice(0, 4000) }); // Trim to 4K chars
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to extract whitepaper.' });
  }
});

app.listen(5001, () => console.log('PDF Extractor running on http://localhost:5001'));
