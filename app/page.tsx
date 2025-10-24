'use client';

import { useState } from 'react';

interface TransformedPrompt {
  original: string;
  transformed: string;
  tropes: string[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TransformedPrompt[]>([]);
  const [error, setError] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile);
        setError('');
      } else {
        setError('Please select a PDF file');
        setFile(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/transform', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 retro-text" style={{
            fontFamily: 'Arial Black, sans-serif',
            letterSpacing: '0.1em'
          }}>
            80s ANIMATION DNA
          </h1>
          <p className="text-xl text-80s-cyan">
            Transform your prompts with radical 1980s animation tropes!
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm p-8 rounded-lg neon-border mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-80s-pink text-lg font-bold mb-2">
                Upload PDF Book of Prompts
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="w-full p-3 bg-purple-900/50 border-2 border-80s-cyan rounded text-white file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-80s-cyan file:text-black hover:file:bg-80s-pink cursor-pointer"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border-2 border-red-500 rounded text-red-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full py-4 px-8 bg-gradient-to-r from-80s-pink to-80s-purple text-white font-bold text-xl rounded-lg hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {loading ? 'TRANSFORMING...' : 'TRANSFORM WITH 80s DNA'}
            </button>
          </form>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-80s-cyan mb-4"></div>
            <p className="text-80s-pink text-xl font-bold">Processing your prompts...</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-80s-cyan mb-4">Transformed Prompts</h2>
            {results.map((result, index) => (
              <div key={index} className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border-2 border-80s-purple">
                <div className="mb-4">
                  <h3 className="text-80s-orange font-bold text-sm mb-2">ORIGINAL PROMPT:</h3>
                  <p className="text-gray-300 italic">{result.original}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-80s-pink font-bold text-sm mb-2">80s ANIMATION DNA:</h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {result.tropes.map((trope, idx) => (
                      <span key={idx} className="px-3 py-1 bg-80s-purple/50 border border-80s-cyan rounded-full text-xs font-bold">
                        {trope}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-80s-cyan font-bold text-sm mb-2">TRANSFORMED PROMPT:</h3>
                  <p className="text-white font-medium bg-purple-900/30 p-4 rounded border-l-4 border-80s-pink">
                    {result.transformed}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
