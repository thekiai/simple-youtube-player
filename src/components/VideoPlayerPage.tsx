import React, { useState, useCallback } from 'react';
import { VideoPlayer } from '../components/VideoPlayer';
import { PlayerControls } from '../components/PlayerControls';
import { FavoriteSegmentForm } from '../components/FavoriteSegmentForm';
import { YouTubePlayer } from '../types/youtube';
import { useFavoriteSegments } from '../hooks/useFavoriteSegments';
import { useFavoriteVideos } from '../hooks/useFavoriteVideos';
import { CreateFavoriteSegment } from '../types/favorite';
import { CreateFavoriteVideo } from '../types/favoriteVideo';

interface VideoPlayerPageProps {
  videoId: string;
}

export const VideoPlayerPage: React.FC<VideoPlayerPageProps> = ({ videoId }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // お気に入り区間の管理
  const { addFavorite, removeFavorite, updateFavorite, getFavoritesByVideoId } = useFavoriteSegments();
  const currentVideoFavorites = getFavoritesByVideoId(videoId);

  // お気に入り動画の管理
  const { favoriteVideos, addFavoriteVideo, removeFavoriteVideo, isFavoriteVideo } = useFavoriteVideos();
  const [isVideoSaved, setIsVideoSaved] = useState(false);

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

  // 動画のお気に入りをつけはずし
  const handleToggleFavorite = useCallback(() => {
    if (isFavoriteVideo(videoId)) {
      // お気に入りから削除
      const favoriteVideo = favoriteVideos.find(fav => fav.videoId === videoId);
      if (favoriteVideo) {
        removeFavoriteVideo(favoriteVideo.id);
      }
    } else {
      // お気に入りに追加
      const videoData: CreateFavoriteVideo = {
        videoId,
        title: `動画 ${videoId}`, // 実際のタイトルは後で取得可能
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
      };
      addFavoriteVideo(videoData);
    }
    
    setIsVideoSaved(true);
    setTimeout(() => {
      setIsVideoSaved(false);
    }, 500);
  }, [videoId, addFavoriteVideo, removeFavoriteVideo, isFavoriteVideo, favoriteVideos]);

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Video Player with Favorite Button */}
      <div className="relative">
        <VideoPlayer
          videoId={videoId}
          onTimeUpdate={handleTimeUpdate}
          onPlayerReady={handlePlayerReady}
        />
        
        {/* Favorite Toggle Button - Player Top Right */}
        <button
          onClick={handleToggleFavorite}
          disabled={isVideoSaved}
          className={`absolute top-2 right-2 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
            isVideoSaved
              ? 'text-yellow-500 cursor-not-allowed bg-white/90'
              : isFavoriteVideo(videoId)
              ? 'text-yellow-500 hover:text-yellow-600 bg-white/90 hover:bg-white'
              : 'text-yellow-400 hover:text-yellow-500 bg-white/90 hover:bg-white'
          }`}
          title={isVideoSaved ? '完了！' : isFavoriteVideo(videoId) ? 'お気に入りから削除' : 'お気に入りに追加'}
        >
          <span className="text-lg">
            {isFavoriteVideo(videoId) ? '★' : '☆'}
          </span>
        </button>
      </div>

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
