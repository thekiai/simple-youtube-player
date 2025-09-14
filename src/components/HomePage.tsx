import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractVideoId } from '../utils/youtube';
import { useFavoriteVideos } from '../hooks/useFavoriteVideos';

export const HomePage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();
  const { favoriteVideos, removeFavoriteVideo } = useFavoriteVideos();

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = extractVideoId(videoUrl);
    if (id) {
      navigate(`/video/${id}`);
    } else {
      alert('Please enter a valid YouTube URL or video ID');
    }
  };

  const handleFavoriteVideoClick = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  const handleRemoveFavorite = (id: string) => {
    removeFavoriteVideo(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Simple YouTube Player
          </h1>
          
          {/* Video URL Input */}
          <form onSubmit={handleVideoSubmit} className="space-y-3">
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Enter YouTube URL or Video ID"
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="w-full py-3 bg-gray-500 hover:bg-gray-600 rounded-lg font-medium transition-colors active:scale-98 text-white"
            >
              Load Video
            </button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Favorite Videos */}
        {favoriteVideos.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">お気に入り動画</h2>
            <div className="space-y-2">
              {favoriteVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleFavoriteVideoClick(video.videoId)}
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-16 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {video.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        保存日: {video.createdAt.toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFavorite(video.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                      title="削除"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center text-gray-600 py-12">
          <p className="mb-4">Enter a YouTube URL above to start watching!</p>
          <p className="text-sm">
            Simple YouTube player with easy rewind controls.
          </p>
          <div className="mt-6 p-4 bg-white rounded-lg text-left shadow-sm border border-gray-200">
            <h4 className="font-semibold mb-2 text-gray-800">📝 Try these video formats:</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <div>• dQw4w9WgXcQ (Video ID)</div>
              <div>• https://youtu.be/dQw4w9WgXcQ</div>
              <div>• https://youtube.com/watch?v=dQw4w9WgXcQ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <h3 className="font-semibold mb-2 text-gray-800">📋 Features:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
            <li>Simple YouTube video playback</li>
            <li>Easy rewind controls (-5s, -2s, -1s)</li>
            <li>Play/Pause functionality</li>
            <li>Current time display</li>
            <li>Direct URL access (e.g., /video/dQw4w9WgXcQ)</li>
          </ul>
          <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
            <strong>Note:</strong> No API keys or authentication required. Just paste any YouTube URL and start watching!
          </div>
        </div>
      </div>
    </div>
  );
};
