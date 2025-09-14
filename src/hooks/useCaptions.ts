import { useState, useEffect, useCallback } from 'react';
interface Caption {
    start: number;
    duration: number;
    text: string;
}

export const useCaptions = (videoId: string) => {
    const [captions, setCaptions] = useState<Caption[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const parseVTT = (vttText: string): Caption[] => {
        const lines = vttText.split('\n');
        const parsedCaptions: Caption[] = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Look for timestamp lines (format: 00:00:00.000 --> 00:00:05.000)
            if (line.includes('-->')) {
                const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})\.(\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})\.(\d{3})/);

                if (timeMatch) {
                    const startTime =
                        parseInt(timeMatch[1]) * 3600 +
                        parseInt(timeMatch[2]) * 60 +
                        parseInt(timeMatch[3]) +
                        parseInt(timeMatch[4]) / 1000;

                    const endTime =
                        parseInt(timeMatch[5]) * 3600 +
                        parseInt(timeMatch[6]) * 60 +
                        parseInt(timeMatch[7]) +
                        parseInt(timeMatch[8]) / 1000;

                    // Get caption text from next non-empty lines
                    const textLines: string[] = [];
                    let j = i + 1;
                    while (j < lines.length && lines[j].trim() !== '') {
                        const text = lines[j].trim();
                        if (text && !text.includes('-->')) {
                            // Remove HTML tags and clean up text
                            textLines.push(text.replace(/<[^>]*>/g, '').trim());
                        }
                        j++;
                    }

                    if (textLines.length > 0) {
                        parsedCaptions.push({
                            start: startTime,
                            duration: endTime - startTime,
                            text: textLines.join(' ')
                        });
                    }

                    i = j - 1; // Skip processed lines
                }
            }
        }

        return parsedCaptions;
    };

    const fetchCaptions = useCallback(async (videoId: string) => {
        const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

        if (!API_KEY || API_KEY === 'your_youtube_api_key_here') {
            setError('YouTube API key is not configured. Please check your .env file.');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // First, get available caption tracks
            const captionsResponse = await fetch(
                `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${API_KEY}`
            );

            if (!captionsResponse.ok) {
                throw new Error(`Failed to fetch captions list: ${captionsResponse.statusText}`);
            }

            const captionsData = await captionsResponse.json();
            const tracks = captionsData.items || [];

            interface CaptionTrack {
                snippet: {
                    language: string;
                    name: string;
                };
            }

            // Find Korean caption track
            const koreanTrack = tracks.find((track: CaptionTrack) =>
                track.snippet.language === 'ko' || track.snippet.language === 'ko-KR'
            );

            if (!koreanTrack) {
                setError('Korean subtitles not available for this video');
                return;
            }

            // Try to get captions using timedtext (this might not work due to CORS)
            try {
                const captionUrl = `https://www.youtube.com/api/timedtext?lang=ko&v=${videoId}`;
                const response = await fetch(captionUrl);

                if (response.ok) {
                    const vttText = await response.text();
                    const parsedCaptions = parseVTT(vttText);
                    setCaptions(parsedCaptions);
                } else {
                    throw new Error('Cannot fetch captions due to CORS policy');
                }
            } catch {
                // Fallback: create sample captions for demonstration
                setError('Captions are available but cannot be fetched due to browser security policies. Using sample captions for demonstration.');

                const sampleCaptions: Caption[] = [
                    { start: 0, duration: 3, text: '안녕하세요! (Hello!)' },
                    { start: 3, duration: 4, text: '오늘은 한국어를 배워보겠습니다. (Today we will learn Korean.)' },
                    { start: 7, duration: 3, text: '첫 번째 단어는... (The first word is...)' },
                    { start: 10, duration: 4, text: '감사합니다. (Thank you.)' },
                    { start: 14, duration: 3, text: '다음 단어를 배워보세요. (Let\'s learn the next word.)' },
                ];

                setCaptions(sampleCaptions);
            }

        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load captions');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (videoId) {
            fetchCaptions(videoId);
        }
    }, [videoId, fetchCaptions]);

    const getCurrentCaption = (currentTime: number): Caption | null => {
        return captions.find(caption =>
            currentTime >= caption.start && currentTime < caption.start + caption.duration
        ) || null;
    };

    return {
        captions,
        loading,
        error,
        getCurrentCaption,
        refetch: () => fetchCaptions(videoId)
    };
};