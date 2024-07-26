'use client';

import React, { useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setImageUrl('');

    try {
      const response = await fetch(`/api/fetch-post?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to fetch post data');

      const imageResponse = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!imageResponse.ok) throw new Error('Failed to generate image');

      const blob = await imageResponse.blob();
      setImageUrl(URL.createObjectURL(blob));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return (
      <div>
        <h1 className="text-2xl font-bold mb-4">X.com Image Generator</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter X.com post URL"
              className="w-full p-2 mb-2 border border-gray-300 rounded"
          />
          <button
              type="submit"
              className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Generate Image
          </button>
        </form>
        {error && (
            <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">
              {error}
            </div>
        )}
        {imageUrl && (
            <div>
              <img src={imageUrl} alt="Generated image" className="mb-2" />
              <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = imageUrl;
                    a.download = 'generated-image.png';
                    a.click();
                  }}
                  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Download Image
              </button>
            </div>
        )}
      </div>
  );
}