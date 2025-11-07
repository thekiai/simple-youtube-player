import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { extractVideoId } from '../utils/youtube';
import { useFavoriteVideos } from '../hooks/useFavoriteVideos';
import { Edit2, Check, X, Trash2 } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();
  const { favoriteVideos, removeFavoriteVideo, updateFavoriteVideo } = useFavoriteVideos();
  
  // 編集状態の管理
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

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

  // 編集開始
  const startEditing = (video: any) => {
    setEditingId(video.id);
    setEditingTitle(video.title);
  };

  // 編集保存
  const saveEditing = () => {
    if (editingId) {
      updateFavoriteVideo(editingId, { title: editingTitle.trim() });
      setEditingId(null);
      setEditingTitle('');
    }
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  // Enterキーで保存
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
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
                      {editingId === video.id ? (
                        // 編集モード
                        <div className="flex items-center space-x-1">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                            autoFocus
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              saveEditing();
                            }}
                            className="flex items-center justify-center w-6 h-6 bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors"
                            title="保存"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelEditing();
                            }}
                            className="flex items-center justify-center w-6 h-6 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded transition-colors"
                            title="キャンセル"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        // 表示モード
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {video.title.trim() || video.originalTitle}
                        </h3>
                      )}
                      <p className="text-xs text-gray-500">
                        保存日: {video.createdAt.toLocaleDateString('ja-JP')}
                      </p>
                    </div>
                    {editingId !== video.id && (
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(video);
                          }}
                          className="flex items-center justify-center w-6 h-6 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                          title="タイトルを編集"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(video.id);
                          }}
                          className="flex items-center justify-center w-6 h-6 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
