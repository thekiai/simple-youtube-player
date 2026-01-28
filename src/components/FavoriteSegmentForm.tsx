import React, { useState, useEffect, useRef } from 'react';
import { Heart, Plus, Check, Play, Pause, Trash2, Edit2, ChevronDown, ChevronUp, X } from 'lucide-react';
import { CreateFavoriteSegment, FavoriteSegment } from '../types/favorite';
import { storage } from '../db/storage';

interface FavoriteSegmentFormProps {
  videoId: string;
  currentTime: number;
  onAddFavorite: (segment: CreateFavoriteSegment) => void;
  favorites: FavoriteSegment[];
  onPlaySegment: (segment: FavoriteSegment) => void;
  onDeleteSegment: (id: string) => void;
  onUpdateSegment: (id: string, updates: { name: string }) => void;
}

const FAVORITE_AREA_HEIGHT_STORAGE_KEY = 'favorite-area-height';
const DEFAULT_HEIGHT = 128; // max-h-32 = 128px
const MIN_HEIGHT = 80;
const MAX_HEIGHT = 400;

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
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [listHeight, setListHeight] = useState(DEFAULT_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartY = useRef(0);
  const resizeStartHeight = useRef(DEFAULT_HEIGHT);
  const listContainerRef = useRef<HTMLDivElement>(null);

  // IndexedDBから高さを読み込み
  useEffect(() => {
    const loadHeight = async () => {
      const savedHeight = await storage.getItem<string | number>(FAVORITE_AREA_HEIGHT_STORAGE_KEY);
      if (savedHeight !== null) {
        const height = typeof savedHeight === 'number' ? savedHeight : parseInt(savedHeight, 10);
        if (height >= MIN_HEIGHT && height <= MAX_HEIGHT) {
          setListHeight(height);
          resizeStartHeight.current = height;
        }
      }
    };
    loadHeight();
  }, []);

  // リサイズ開始（マウス）
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartY.current = e.clientY;
    resizeStartHeight.current = listHeight;
  };

  // リサイズ開始（タッチ）
  const handleResizeStartTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartY.current = e.touches[0].clientY;
    resizeStartHeight.current = listHeight;
  };

  // リサイズ中
  useEffect(() => {
    if (isResizing) {
      // リサイズ中はテキスト選択を無効化
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ns-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - resizeStartY.current;
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStartHeight.current + deltaY));
      setListHeight(newHeight);
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsResizing(false);
      // 最終的な高さを計算して保存
      const deltaY = e.clientY - resizeStartY.current;
      const finalHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStartHeight.current + deltaY));
      storage.setItem(FAVORITE_AREA_HEIGHT_STORAGE_KEY, finalHeight);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaY = e.touches[0].clientY - resizeStartY.current;
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStartHeight.current + deltaY));
      setListHeight(newHeight);
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setIsResizing(false);
      // 最終的な高さを計算して保存
      if (e.changedTouches.length > 0) {
        const deltaY = e.changedTouches[0].clientY - resizeStartY.current;
        const finalHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, resizeStartHeight.current + deltaY));
        storage.setItem(FAVORITE_AREA_HEIGHT_STORAGE_KEY, finalHeight);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizing]);

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

  // 現在秒数がお気に入り秒数の範囲内かどうかを判定
  const isInFavoriteRange = (startTime: number, index: number) => {
    // 現在秒数がこのお気に入り秒数に到達しているか
    const hasReachedThisTime = currentTime >= startTime;
    
    // 次のお気に入り秒数を取得（なければ最後まで）
    const nextFavorite = sortedFavorites[index + 1];
    const hasNotReachedNextTime = !nextFavorite || currentTime < nextFavorite.startTime;
    
    return hasReachedThisTime && hasNotReachedNextTime;
  };

  // お気に入りが現在再生中かどうかを判定
  const isCurrentlyPlaying = (favoriteId: string, startTime: number, index: number) => {
    // クリックされたアイテムの場合は優先
    if (currentlyPlayingId === favoriteId) {
      return true;
    }
    // クリックされたアイテムがない場合のみ範囲判定を使用
    if (currentlyPlayingId === null) {
      return isInFavoriteRange(startTime, index);
    }
    // 他のアイテムがクリックされている場合はfalse
    return false;
  };

  // 再生ボタンのクリックハンドラー
  const handlePlayClick = (favorite: FavoriteSegment) => {
    // 即座にアイコンを変更
    setCurrentlyPlayingId(favorite.id);
    
    // 実際の再生処理
    onPlaySegment(favorite);
    
    // 少し遅れて状態をリセット（実際の再生が開始された後）
    setTimeout(() => {
      setCurrentlyPlayingId(null);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 relative">
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
            <div className="mt-2 relative">
              <div 
                ref={listContainerRef}
                className="overflow-y-auto space-y-1 pr-2"
                style={{ height: `${listHeight}px` }}
              >
                {sortedFavorites.map((favorite, index) => (
                  <div key={favorite.id} className={`p-2 hover:bg-gray-50 transition-colors rounded ${isCurrentlyPlaying(favorite.id, favorite.startTime, index) ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-center">
                      {/* 再生ボタン（一番左） */}
                      {editingId !== favorite.id && (
                        <button
                          onClick={() => handlePlayClick(favorite)}
                          className="flex items-center justify-center w-6 h-6 bg-green-50 hover:bg-green-100 text-green-600 rounded transition-colors mr-2"
                          title={isCurrentlyPlaying(favorite.id, favorite.startTime, index) ? "現在再生中" : "この区間を再生"}
                        >
                          {isCurrentlyPlaying(favorite.id, favorite.startTime, index) ? (
                            <Pause className="w-3 h-3" />
                          ) : (
                            <Play className="w-3 h-3" />
                          )}
                        </button>
                      )}
                      
                      {/* 名前と時間の情報（クリックで再生） */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5 -mx-1 -my-0.5 transition-colors"
                        onClick={() => handlePlayClick(favorite)}
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
                              onBlur={saveEditing}
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
      {/* リサイズハンドル（枠内） */}
      {favorites.length > 0 && isOpen && (
        <div
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStartTouch}
          className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-4 cursor-ns-resize flex items-center justify-center touch-none ${
            isResizing ? 'opacity-100' : 'opacity-60 hover:opacity-100'
          } transition-opacity z-10`}
          title="ドラッグしてサイズを変更"
        >
          <div className="flex flex-col items-center gap-0.5">
            <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
            <div className="w-6 h-0.5 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      )}
    </div>
  );
};
