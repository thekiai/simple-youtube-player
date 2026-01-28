/**
 * localStorage → IndexedDB 自動マイグレーション
 */

import { storage } from './storage';

const MIGRATION_KEY = 'idb-migration-completed';

// マイグレーション対象のlocalStorageキー一覧
const STORAGE_KEYS = [
  'youtube-player-favorites',
  'youtube-player-favorite-videos',
  'favorite-area-height',
];

export async function migrateFromLocalStorage(): Promise<void> {
  // 既にマイグレーション完了している場合はスキップ
  const migrated = await storage.getItem<boolean>(MIGRATION_KEY);
  if (migrated) {
    return;
  }

  console.log('Starting migration from localStorage to IndexedDB...');

  let migratedCount = 0;
  for (const key of STORAGE_KEYS) {
    try {
      const value = localStorage.getItem(key);
      if (value !== null) {
        // JSONとしてパースして保存（パースできない場合はそのまま）
        try {
          const parsed = JSON.parse(value);
          await storage.setItem(key, parsed);
        } catch {
          // JSONでない場合（数値文字列など）はそのまま保存
          await storage.setItem(key, value);
        }
        migratedCount++;
      }
    } catch (e) {
      console.error(`Failed to migrate key: ${key}`, e);
    }
  }

  // マイグレーション完了フラグを設定
  await storage.setItem(MIGRATION_KEY, true);
  console.log(`Migration completed. Migrated ${migratedCount} keys.`);
}
