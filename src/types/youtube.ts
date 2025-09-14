export interface YouTubePlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    getCurrentTime: () => number;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getPlayerState: () => number;
    getVideoData: () => { title: string; video_id: string; author: string };
}

declare global {
    interface Window {
        YT: {
            Player: new (
                elementId: string,
                config: {
                    height: string;
                    width: string;
                    videoId: string;
                    events: {
                        onReady: (event: { target: YouTubePlayer }) => void;
                        onStateChange: (event: { data: number }) => void;
                    };
                }
            ) => YouTubePlayer;
            PlayerState: {
                UNSTARTED: number;
                ENDED: number;
                PLAYING: number;
                PAUSED: number;
                BUFFERING: number;
                CUED: number;
            };
        };
        onYouTubeIframeAPIReady: () => void;
    }
}