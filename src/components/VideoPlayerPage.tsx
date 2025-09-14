import React, { useState, useCallback } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { PlayerControls } from '../components/PlayerControls';
import { FavoriteSegmentForm } from '../components/FavoriteSegmentForm';
import { YouTubePlayer } from '../types/youtube';
import { useFavoriteSegments } from '../hooks/useFavoriteSegments';
import { CreateFavoriteSegment } from '../types/favorite';

interface VideoPlayerPageProps {
  videoId: string;
}

export const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ videoId }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // お気に入りの管理
  const { addFavorite, removeFavorite, updateFavorite, getFavoritesByVideoId } = useFavoriteSegments();
  const currentVideoFavorites = getFavoritesByVideoId(videoId);

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

  // お気に入りを追加
  const handleAddFavorite = useCallback((segment: CreateFavoriteSegment) => {
    addFavorite(segment);
  }, [addFavorite]);

  // お気に入りを削除
  const handleDeleteFavorite = useCallback((id: string) => {
    removeFavorite(id);
  }, [removeFavorite]);

  // お気に入りを更新
  const handleUpdateFavorite = useCallback((id: string, updates: { name: string }) => {
    updateFavorite(id, updates);
  }, [updateFavorite]);

  // お気に入りを再生
  const handlePlaySegment = useCallback((segment: CreateFavoriteSegment) => {
    if (player) {
      // 開始時間に移動
      player.seekTo(segment.startTime, true);
      // 再生開始
      player.playVideo();
      setIsPlaying(true);
    }
  }, [player]);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Video Player */}
      <VideoPlayer
        videoId={videoId}
        onTimeUpdate={handleTimeUpdate}
        onPlayerReady={handlePlayerReady}
      />

      {/* Favorite Segment Form & List */}
      <FavoriteSegmentForm
        videoId={videoId}
        currentTime={currentTime}
        onAddFavorite={handleAddFavorite}
        favorites={currentVideoFavorites}
        onPlaySegment={handlePlaySegment}
        onDeleteSegment={handleDeleteFavorite}
        onUpdateSegment={handleUpdateFavorite}
      />

      {/* Player Controls */}
      <PlayerControls
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeekBack={handleSeekBack}
      />
    </div>
  );
};
