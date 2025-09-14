// お気に入り動画の型定義
export interface FavoriteVideo {
    id: string;
    videoId: string;
    title: string;
    originalTitle: string; // オリジナルの動画タイトル
    thumbnailUrl: string;
    createdAt: Date;
}

// お気に入り動画の作成用の型
export interface CreateFavoriteVideo {
    videoId: string;
    title: string;
    originalTitle: string; // オリジナルの動画タイトル
    thumbnailUrl: string;
}
