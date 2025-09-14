import { useState, useEffect, useRef } from 'react';

interface YouTubePlayerInstance {
    playVideo: () => void;
    pauseVideo: () => void;
    getCurrentTime: () => number;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    getPlayerState: () => number;
    getVideoData: () => { title: string; video_id: string; author: string };
    destroy?: () => void;
}

export const useYouTubePlayer = (videoId: string) => {
    const [player, setPlayer] = useState<YouTubePlayerInstance | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const playerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!videoId) return;

        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initializePlayer;
        } else {
            initializePlayer();
        }

        function initializePlayer() {
            if (!playerRef.current || !videoId) return;

            // Clear any existing player
            if (player) {
                try {
                    player.destroy?.();
                } catch (e) {
                    console.log('Error destroying previous player:', e);
                }
            }

            new window.YT.Player(playerRef.current, {
                height: '315',
                width: '100%',
                videoId: videoId,
                playerVars: {
                    autoplay: 0,
                    controls: 1,
                    disablekb: 0,
                    enablejsapi: 1,
                    fs: 1,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    showinfo: 0,
                    origin: window.location.origin
                },
                events: {
                    onReady: (event) => {
                        setPlayer(event.target);
                        setIsReady(true);
                        console.log('YouTube player ready');
                    },
                    onStateChange: (event) => {
                        setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                        console.log('Player state changed:', event.data);
                    },
                    onError: (event) => {
                        console.error('YouTube player error:', event.data);
                    },
                },
            });
        }

        // Cleanup function
        return () => {
            setIsReady(false);
        };
    }, [videoId]);

    // Update current time
    useEffect(() => {
        if (!player || !isReady) return;

        const interval = setInterval(() => {
            if (isPlaying) {
                try {
                    const time = player.getCurrentTime();
                    setCurrentTime(time);
                } catch (e) {
                    console.log('Error getting current time:', e);
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [player, isPlaying, isReady]);

    const play = () => {
        if (player && isReady) {
            try {
                player.playVideo();
            } catch (e) {
                console.log('Error playing video:', e);
            }
        }
    };

    const pause = () => {
        if (player && isReady) {
            try {
                player.pauseVideo();
            } catch (e) {
                console.log('Error pausing video:', e);
            }
        }
    };

    const seekTo = (seconds: number) => {
        if (player && isReady) {
            try {
                const newTime = Math.max(0, currentTime + seconds);
                player.seekTo(newTime, true);
                setCurrentTime(newTime);
            } catch (e) {
                console.log('Error seeking video:', e);
            }
        }
    };

    return {
        playerRef,
        player,
        isPlaying,
        currentTime,
        isReady,
        play,
        pause,
        seekTo,
    };
};