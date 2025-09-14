// お気に入りの型定義
export interface FavoriteSegment {
    id: string;
    name: string;
    startTime: number;
    videoId: string;
    createdAt: Date;
}

// お気に入りの作成用の型
export interface CreateFavoriteSegment {
    name: string;
    startTime: number;
    videoId: string;
}
