import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  
  if (!videoId) {
    return <div>Video ID not found</div>;
  }

  const handleHeaderClick = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Small header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-2">
          <h1 
            onClick={handleHeaderClick}
            className="text-sm font-medium text-gray-600 text-center cursor-pointer hover:text-gray-800 transition-colors"
            title="ホームに戻る"
          >
            Simple YouTube Player
          </h1>
        </div>
      </div>

      <VideoPlayerPage videoId={videoId} />
    </div>
  );
}

export default App;