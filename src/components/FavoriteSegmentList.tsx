import React, { useState } from 'react';
import { Play, Trash2, Heart, Edit2, Check, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FavoriteSegment } from '../types/favorite';

interface FavoriteSegmentListProps {
  favorites: FavoriteSegment[];
  onPlaySegment: (segment: FavoriteSegment) => void;
  onDeleteSegment: (id: string) => void;
  onUpdateSegment: (id: string, updates: { name: string }) => void;
}

export const FavoriteSegmentList: React.FC<FavoriteSegmentListProps> = ({
  favorites,
  onPlaySegment,
  onDeleteSegment,
  onUpdateSegment
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 時間を分:秒形式で表示
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 編集開始
  const startEditing = (favorite: FavoriteSegment) => {
    setEditingId(favorite.id);
    setEditingName(favorite.name);
  };

  // 編集保存
  const saveEditing = () => {
    if (editingId) {
      onUpdateSegment(editingId, { name: editingName.trim() });
      setEditingId(null);
      setEditingName('');
    }
  };

  // 編集キャンセル
  const cancelEditing = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Enterキーで保存
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      saveEditing();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  // 開始秒数でソート
  const sortedFavorites = [...favorites].sort((a, b) => a.startTime - b.startTime);

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-3 py-2 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 flex items-center">
            <Heart className="w-4 h-4 text-gray-400 mr-2" />
            お気に入り (0)
          </h3>
        </div>
        <div className="p-4 text-center">
          <Heart className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-xs">
            まだお気に入りが登録されていません
          </p>
          <p className="text-gray-400 text-xs mt-1">
            上のボタンから区間を登録してください
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* アコーディオンヘッダー */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <h3 className="text-sm font-medium text-gray-600 flex items-center">
          <Heart className="w-4 h-4 text-gray-400 mr-2" />
          お気に入り ({favorites.length})
        </h3>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      
      {/* アコーディオンコンテンツ */}
      {isOpen && (
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-100">
            {sortedFavorites.map((favorite) => (
              <div key={favorite.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {editingId === favorite.id ? (
                      // 編集モード
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent"
                          autoFocus
                        />
                        <button
                          onClick={saveEditing}
                          className="flex items-center justify-center w-5 h-5 bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors"
                          title="保存"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center justify-center w-5 h-5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded transition-colors"
                          title="キャンセル"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      // 表示モード
                      <h4 className="text-xs font-medium text-gray-700 truncate">
                        {favorite.name || `区間 ${formatTime(favorite.startTime)}`}
                      </h4>
                    )}
                    <div className="mt-1 text-xs text-gray-400">
                      <span>
                        開始時間: {formatTime(favorite.startTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-3">
                    {editingId !== favorite.id && (
                      <>
                        <button
                          onClick={() => onPlaySegment(favorite)}
                          className="flex items-center justify-center w-6 h-6 bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors"
                          title="この区間を再生"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => startEditing(favorite)}
                          className="flex items-center justify-center w-6 h-6 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                          title="名前を編集"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        
                        <button
                          onClick={() => onDeleteSegment(favorite.id)}
                          className="flex items-center justify-center w-6 h-6 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
