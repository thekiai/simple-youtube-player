import { useState, useEffect } from 'react';
import { FavoriteSegment, CreateFavoriteSegment } from '../types/favorite';
import { storage } from '../db/storage';

// IndexedDBのキー
const FAVORITES_STORAGE_KEY = 'youtube-player-favorites';

export const useFavoriteSegments = () => {
    const [favorites, setFavorites] = useState<FavoriteSegment[]>([]);

    // IndexedDBからお気に入りを読み込み
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const stored = await storage.getItem<FavoriteSegment[]>(FAVORITES_STORAGE_KEY);
                if (stored) {
                    // Dateオブジェクトを復元
                    const favoritesWithDates = stored.map((fav: any) => ({
                        ...fav,
                        createdAt: new Date(fav.createdAt)
                    }));
                    setFavorites(favoritesWithDates);
                }
            } catch (error) {
                console.error('Failed to load favorites from IndexedDB:', error);
            }
        };

        loadFavorites();
    }, []);

    // IndexedDBにお気に入りを保存
    const saveFavorites = (newFavorites: FavoriteSegment[]) => {
        storage.setItem(FAVORITES_STORAGE_KEY, newFavorites);
        setFavorites(newFavorites);
    };

    // お気に入りを追加
    const addFavorite = (segment: CreateFavoriteSegment) => {
        const newFavorite: FavoriteSegment = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            ...segment,
            createdAt: new Date()
        };

        const newFavorites = [...favorites, newFavorite];
        saveFavorites(newFavorites);
        return newFavorite;
    };

    // お気に入りを削除
    const removeFavorite = (id: string) => {
        const newFavorites = favorites.filter(fav => fav.id !== id);
        saveFavorites(newFavorites);
    };

    // 特定の動画のお気に入りを取得
    const getFavoritesByVideoId = (videoId: string) => {
        return favorites.filter(fav => fav.videoId === videoId);
    };

    // お気に入りを更新
    const updateFavorite = (id: string, updates: Partial<CreateFavoriteSegment>) => {
        const newFavorites = favorites.map(fav =>
            fav.id === id ? { ...fav, ...updates } : fav
        );
        saveFavorites(newFavorites);
    };

    return {
        favorites,
        addFavorite,
        removeFavorite,
        updateFavorite,
        getFavoritesByVideoId
    };
};
