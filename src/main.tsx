import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { migrateFromLocalStorage } from './db/migration';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}
// ベースパスを動的に決定（Viteのbase設定と一致させる）
const basename = import.meta.env.BASE_URL === '/' ? '' : import.meta.env.BASE_URL.slice(0, -1);

// localStorageからIndexedDBへマイグレーション後にアプリを起動
migrateFromLocalStorage().then(() => {
  createRoot(rootElement).render(
      <StrictMode>
        <BrowserRouter basename={basename}>
          <App />
        </BrowserRouter>
      </StrictMode>
  );
});
