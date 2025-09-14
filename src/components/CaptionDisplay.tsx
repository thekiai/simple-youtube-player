import React from 'react';
import { Caption } from '../types/youtube';

interface CaptionDisplayProps {
  captions: Caption[];
  currentTime: number;
  loading: boolean;
  error?: string | null;
}

export const CaptionDisplay: React.FC<CaptionDisplayProps> = ({
  captions,
  currentTime,
  loading,
  error
}) => {
  const getCurrentCaption = (currentTime: number): Caption | null => {
    return captions.find(caption => 
      currentTime >= caption.start && currentTime < caption.start + caption.duration
    ) || null;
  };

  const currentCaption = getCurrentCaption(currentTime);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-48 flex items-center justify-center">
        <div className="text-gray-400">Loading captions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 h-48">
        <div className="text-red-400 text-sm mb-4">{error}</div>
        {captions.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {captions.map((caption, index) => (
              <div
                key={index}
                className={`p-2 rounded transition-colors ${
                  currentCaption?.text === caption.text
                    ? 'bg-blue-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <div className="text-sm text-gray-400">
                  {Math.floor(caption.start)}s
                </div>
                <div className="font-medium" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                  {caption.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-48">
      <div className="h-full flex flex-col">
        {/* Current Caption */}
        <div className="flex-1 flex items-center justify-center mb-4">
          {currentCaption ? (
            <div className="text-center">
              <div className="text-2xl font-medium text-white mb-2" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                {currentCaption.text}
              </div>
              <div className="text-sm text-gray-400">
                {Math.floor(currentCaption.start)}s - {Math.floor(currentCaption.start + currentCaption.duration)}s
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">No caption at current time</div>
          )}
        </div>

        {/* All Captions Scroll */}
        <div className="max-h-24 overflow-y-auto space-y-1 border-t border-gray-700 pt-4">
          {captions.map((caption, index) => (
            <div
              key={index}
              className={`p-2 rounded text-sm transition-colors cursor-pointer ${
                currentCaption?.text === caption.text
                  ? 'bg-blue-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="text-xs text-gray-400 mr-2">
                {Math.floor(caption.start)}s
              </span>
              <span style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                {caption.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};