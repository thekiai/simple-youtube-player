import { useState, useEffect } from 'react';
import { FavoriteVideo, CreateFavoriteVideo } from '../types/favoriteVideo';
import { storage } from '../db/storage';

// IndexedDBのキー
const FAVORITE_VIDEOS_STORAGE_KEY = 'youtube-player-favorite-videos';

export const useFavoriteVideos = () => {
    const [favoriteVideos, setFavoriteVideos] = useState<FavoriteVideo[]>([]);

    // IndexedDBからお気に入り動画を読み込み
    useEffect(() => {
        const loadFavoriteVideos = async () => {
            try {
                const stored = await storage.getItem<FavoriteVideo[]>(FAVORITE_VIDEOS_STORAGE_KEY);
                if (stored) {
                    // Dateオブジェクトを復元し、originalTitleがない場合はtitleを設定
                    const videosWithDates = stored.map((video: any) => ({
                        ...video,
                        createdAt: new Date(video.createdAt),
                        originalTitle: video.originalTitle || video.title // 互換性のため
                    }));
                    setFavoriteVideos(videosWithDates);
                }
            } catch (error) {
                console.error('Failed to load favorite videos from IndexedDB:', error);
            }
        };

        loadFavoriteVideos();
    }, []);

    // IndexedDBにお気に入り動画を保存
    const saveFavoriteVideos = (newVideos: FavoriteVideo[]) => {
        storage.setItem(FAVORITE_VIDEOS_STORAGE_KEY, newVideos);
        setFavoriteVideos(newVideos);
    };

    // お気に入り動画を追加
    const addFavoriteVideo = (video: CreateFavoriteVideo) => {
        // 既に同じ動画が登録されているかチェック
        const existingVideo = favoriteVideos.find(v => v.videoId === video.videoId);
        if (existingVideo) {
            return existingVideo; // 既に登録済みの場合は既存の動画を返す
        }

        const newVideo: FavoriteVideo = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...video,
            createdAt: new Date()
        };

        const newVideos = [...favoriteVideos, newVideo];
        saveFavoriteVideos(newVideos);
        return newVideo;
    };

    // お気に入り動画を削除
    const removeFavoriteVideo = (id: string) => {
        const newVideos = favoriteVideos.filter(video => video.id !== id);
        saveFavoriteVideos(newVideos);
    };

    // お気に入り動画のタイトルを更新
    const updateFavoriteVideo = (id: string, updates: { title: string }) => {
        const newVideos = favoriteVideos.map(video =>
            video.id === id ? { ...video, ...updates } : video
        );
        saveFavoriteVideos(newVideos);
    };

    // 動画IDでお気に入り動画を取得
    const getFavoriteVideoByVideoId = (videoId: string) => {
        return favoriteVideos.find(video => video.videoId === videoId);
    };

    // お気に入り動画かどうかをチェック
    const isFavoriteVideo = (videoId: string) => {
        return favoriteVideos.some(video => video.videoId === videoId);
    };

    return {
        favoriteVideos,
        addFavoriteVideo,
        removeFavoriteVideo,
        updateFavoriteVideo,
        getFavoriteVideoByVideoId,
        isFavoriteVideo
    };
};
