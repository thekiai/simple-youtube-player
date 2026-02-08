import React from 'react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';

interface VideoPlayerProps {
  videoId: string;
  onTimeUpdate?: (currentTime: number) => void;
  onPlayerReady?: (player: ReturnType<typeof useYouTubePlayer>['player']) => void;
  onPlayingChange?: (isPlaying: boolean) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoId,
  onTimeUpdate,
  onPlayerReady,
  onPlayingChange
}) => {
  const { playerRef, player, currentTime, isReady, isPlaying } = useYouTubePlayer(videoId);

  React.useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(currentTime);
    }
  }, [currentTime, onTimeUpdate]);

  React.useEffect(() => {
    if (player && isReady && onPlayerReady) {
      onPlayerReady(player);
    }
  }, [player, isReady, onPlayerReady]);

  React.useEffect(() => {
    if (onPlayingChange) {
      onPlayingChange(isPlaying);
    }
  }, [isPlaying, onPlayingChange]);

  return (
    <div className="w-full relative">
      {!isReady && (
        <div className="absolute inset-0 bg-gray-800 rounded-lg flex items-center justify-center z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <div className="text-sm">Loading video...</div>
          </div>
        </div>
      )}
      <div 
        ref={playerRef}
        className="w-full h-56 bg-black rounded-lg overflow-hidden"
        id={`youtube-player-${videoId}`}
      />
    </div>
  );
};