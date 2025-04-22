import React, { useEffect, useState } from 'react';
import axios from 'axios';

function WhitepaperLLM({ id }) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    if (analysis) return;

    const fetchAnalysis = async () => {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:5001/analyze-whitepaper', {
          coinId: id,
        });
        setAnalysis(res.data.analysis);
      } catch (err) {
        console.error('❌ LLM backend error:', err.message);
        setAnalysis('❌ Failed to analyze whitepaper.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [id]);

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50 whitespace-pre-wrap text-sm">
      {loading ? '🔍 Analyzing whitepaper...' : analysis}
    </div>
  );
}

export default WhitepaperLLM;