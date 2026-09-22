const DB_NAME = 'krafc_assets_db';
const STORE_NAME = 'custom_blobs';
const WALL_IMG_STORE = 'wall_images'; // stores base64 data URL strings keyed by stable ID

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    // Version 2 adds the wall_images store
    const request = indexedDB.open(DB_NAME, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(WALL_IMG_STORE)) {
        db.createObjectStore(WALL_IMG_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Custom 3D asset blob storage ---

export async function saveAssetBlob(id: string, blob: Blob): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(blob, id);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB save warning:', err);
  }
}

export async function getAssetBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(id);
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteAssetBlob(id: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).delete(id);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB delete warning:', err);
  }
}

export async function clearAllAssetBlobs(): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('IndexedDB clear warning:', err);
  }
}

// --- Wall banner / frame image persistence via IndexedDB ---
// Stores the full data URL string. Key is a stable ID like "wel_<welId>".
// This way banner images survive page reload without blowing localStorage or cloud DB limits.

export async function saveWallImageDataUrl(key: string, dataUrl: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(WALL_IMG_STORE, 'readwrite');
    tx.objectStore(WALL_IMG_STORE).put(dataUrl, key);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('Wall image IDB save warning:', err);
  }
}

export async function getWallImageDataUrl(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(WALL_IMG_STORE, 'readonly');
    const request = tx.objectStore(WALL_IMG_STORE).get(key);
    return new Promise((resolve) => {
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function deleteWallImageDataUrl(key: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(WALL_IMG_STORE, 'readwrite');
    tx.objectStore(WALL_IMG_STORE).delete(key);
    await new Promise((resolve, reject) => {
      tx.oncomplete = resolve;
      tx.onerror = reject;
    });
  } catch (err) {
    console.warn('Wall image IDB delete warning:', err);
  }
}
