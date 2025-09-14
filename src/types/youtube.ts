export interface YouTubePlayer {
    playVideo: () => void;
    pauseVideo: () => void;
    getCurrentTime: () => number;
    seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
    getPlayerState: () => number;
}

export interface Caption {
    start: number;
    duration: number;
    text: string;
}

export interface CaptionTrack {
    id: string;
    name: string;
    languageCode: string;
    url: string;
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
                        onReady: (event: any) => void;
                        onStateChange: (event: any) => void;
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