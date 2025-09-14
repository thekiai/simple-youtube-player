import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractVideoId } from '../utils/youtube';

export const HomePage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(videoUrl);
    if (id) {
      navigate(`/video/${id}`);
    } else {
      alert('Please enter a valid YouTube URL or video ID');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-4">
            🎬 YouTube Player
          </h1>
          
          {/* Video URL Input */}
          <form onSubmit={handleVideoSubmit} className="space-y-3">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube URL or Video ID"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors active:scale-98"
            >
              Load Video
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="text-center text-gray-400 py-12">
          <p className="mb-4">Enter a YouTube URL above to start watching!</p>
          <p className="text-sm">
            Simple YouTube player with easy rewind controls.
          </p>
          <div className="mt-6 p-4 bg-gray-800 rounded-lg text-left">
            <h4 className="font-semibold mb-2">📝 Try these video formats:</h4>
            <div className="text-xs space-y-1">
              <div>• dQw4w9WgXcQ (Video ID)</div>
              <div>• https://youtu.be/dQw4w9WgXcQ</div>
              <div>• https://youtube.com/watch?v=dQw4w9WgXcQ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">📋 Features:</h3>
          <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li>Simple YouTube video playback</li>
            <li>Easy rewind controls (-5s, -2s, -1s)</li>
            <li>Play/Pause functionality</li>
            <li>Current time display</li>
            <li>Direct URL access (e.g., /video/dQw4w9WgXcQ)</li>
          </ul>
          <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
            <strong>Note:</strong> No API keys or authentication required. Just paste any YouTube URL and start watching!
          </div>
        </div>
      </div>
    </div>
  );
};
