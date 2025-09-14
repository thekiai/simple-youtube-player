import { Routes, Route, useParams } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { VideoPlayerPage } from './components/VideoPlayerPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/video/:videoId" element={<VideoPlayerRoute />} />
    </Routes>
  );
}

// 動画IDを取得してVideoPlayerPageに渡すコンポーネント
function VideoPlayerRoute() {
  const { videoId } = useParams<{ videoId: string }>();
  
  if (!videoId) {
    return <div>Video ID not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header with back button */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg text-gray-700 text-sm transition-colors"
            >
              ← Back
            </button>
            <h1 className="text-xl font-bold text-gray-800">Simple YouTube Player</h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <VideoPlayerPage videoId={videoId} />
    </div>
  );
}

export default App;