import React, { useState, useCallback } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { PlayerControls } from '../components/PlayerControls';
import { YouTubePlayer } from '../types/youtube';

interface VideoPlayerPageProps {
  videoId: string;
}

export const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ videoId }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleTimeUpdate = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const handlePlayerReady = useCallback((playerInstance: YouTubePlayer | null) => {
    if (playerInstance) {
      setPlayer(playerInstance);
      console.log('Player ready in VideoPlayerPage component');
    }
  }, []);

  const handlePlay = () => {
    if (player) {
      player.playVideo();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  const handleSeekBack = (seconds: number) => {
    if (player) {
      const newTime = Math.max(0, currentTime + seconds);
      player.seekTo(newTime, true);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Video Player */}
      <VideoPlayer
        videoId={videoId}
        onTimeUpdate={handleTimeUpdate}
        onPlayerReady={handlePlayerReady}
      />

      {/* Player Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeekBack={handleSeekBack}
      />

      {/* Current Time Display */}
      <div className="text-center text-gray-600 text-sm bg-white rounded-lg p-3 shadow-sm border border-gray-200">
        Current Time: {Math.floor(currentTime)}s
        {player ? ' • Player Ready' : ' • Loading Player...'}
      </div>
    </div>
  );
};
