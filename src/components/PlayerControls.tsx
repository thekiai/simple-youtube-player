import React from 'react';
import { Play, Pause } from 'lucide-react';

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeekBack: (seconds: number) => void;
}

export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlay,
  onPause,
  onSeekBack
}) => {
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
      <div className="flex flex-col items-center space-y-3">
        {/* 再生ボタン */}
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="px-8 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center w-20"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" fill="currentColor" />
          ) : (
            <Play className="w-5 h-5" fill="currentColor" />
          )}
        </button>

        {/* 秒数ボタン群 */}
        <div className="flex items-center justify-center space-x-3">
          {/* 戻るボタン */}
          <button
            onClick={() => onSeekBack(-5)}
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium transition-colors"
          >
            -5s
          </button>

          <button
            onClick={() => onSeekBack(-2)}
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium transition-colors"
          >
            -2s
          </button>

          <button
            onClick={() => onSeekBack(-1)}
            className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium transition-colors"
          >
            -1s
          </button>

          {/* 送るボタン */}
          <button
            onClick={() => onSeekBack(1)}
            className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm font-medium transition-colors"
          >
            +1s
          </button>

          <button
            onClick={() => onSeekBack(2)}
            className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm font-medium transition-colors"
          >
            +2s
          </button>

          <button
            onClick={() => onSeekBack(5)}
            className="px-3 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm font-medium transition-colors"
          >
            +5s
          </button>
        </div>
      </div>
    </div>
  );
};