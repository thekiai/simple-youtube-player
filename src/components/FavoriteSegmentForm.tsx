import React, { useState } from 'react';
import { Heart, Plus, Check, Play, Trash2, Edit2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { CreateFavoriteSegment, FavoriteSegment } from '../types/favorite';

interface FavoriteSegmentFormProps {
  videoId: string;
  currentTime: number;
  onAddFavorite: (segment: CreateFavoriteSegment) => void;
  favorites: FavoriteSegment[];
  onPlaySegment: (segment: FavoriteSegment) => void;
  onDeleteSegment: (id: string) => void;
  onUpdateSegment: (id: string, updates: { name: string }) => void;
}

export const FavoriteSegmentForm: React.FC<FavoriteSegmentFormProps> = ({
  videoId,
  currentTime,
  onAddFavorite,
  favorites,
  onPlaySegment,
  onDeleteSegment,
  onUpdateSegment
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  // お気に入りを即座に追加
  const handleQuickRegister = () => {
    onAddFavorite({
      name: '', // 空の名前で登録
      startTime: Math.floor(currentTime),
      videoId
    });
    
    // 登録完了のフィードバック
    setIsRegistered(true);
    setTimeout(() => {
      setIsRegistered(false);
    }, 1000); // 2秒後にフィードバックを消す
  };

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

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
      {/* 登録ボタン */}
      <button
        onClick={handleQuickRegister}
        disabled={isRegistered}
        className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm transition-colors ${
          isRegistered
            ? 'bg-green-50 border border-green-200 text-green-600 cursor-not-allowed'
            : 'bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-700'
        }`}
      >
        {isRegistered ? (
          <>
            <Check className="w-4 h-4" />
            <span>登録完了！</span>
          </>
        ) : (
          <>
            <Heart className="w-4 h-4" />
            <span>この瞬間をお気に入りに登録</span>
            <Plus className="w-3 h-3" />
          </>
        )}
      </button>
      
      {/* お気に入り一覧（アコーディオン） */}
      {favorites.length > 0 && (
        <div className="mt-3">
          {/* アコーディオンヘッダー */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between hover:bg-gray-50 transition-colors rounded px-2 py-1"
          >
            <h3 className="text-sm font-medium text-gray-600 flex items-center">
              {/* <Heart className="w-4 h-4 text-gray-400 mr-2" /> */}
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
            <div className="mt-2">
              <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                {sortedFavorites.map((favorite) => (
                  <div key={favorite.id} className="p-2 hover:bg-gray-50 transition-colors rounded">
                    <div className="flex items-center">
                      {/* 再生ボタン（一番左） */}
                      {editingId !== favorite.id && (
                        <button
                          onClick={() => onPlaySegment(favorite)}
                          className="flex items-center justify-center w-6 h-6 bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors mr-2"
                          title="この区間を再生"
                        >
                          <Play className="w-3 h-3" />
                        </button>
                      )}
                      
                      {/* 名前と時間の情報（クリックで再生） */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors"
                        onClick={() => onPlaySegment(favorite)}
                        title="クリックして再生"
                      >
                        {editingId === favorite.id ? (
                          // 編集モード
                          <div className="flex items-center space-x-1">
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
                            {favorite.name || formatTime(favorite.startTime)}
                          </h4>
                        )}
                        <div className="text-xs text-gray-400">
                          <span>
                            開始時間: {formatTime(favorite.startTime)}
                          </span>
                        </div>
                      </div>
                      
                      {/* 削除・編集ボタン（右側） */}
                      {editingId !== favorite.id && (
                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            onClick={() => onDeleteSegment(favorite.id)}
                            className="flex items-center justify-center w-6 h-6 bg-red-50 hover:bg-red-100 text-red-600 rounded transition-colors"
                            title="削除"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => startEditing(favorite)}
                            className="flex items-center justify-center w-6 h-6 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                            title="名前を編集"
                          >
                            <Edit2 className="w-3 h-3" />
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
      )}
    </div>
  );
};
