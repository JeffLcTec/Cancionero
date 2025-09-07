// src/utils/storage.ts
// Almacenamiento local robusto (IndexedDB) + respaldo automático en archivo (File System Access API)

// Update the import path below if your Song type is located elsewhere
import type { Song } from "../types/song";

const DB_NAME = "songbook-db";
const STORE = "kv";
const KEY_SONGS = "songs-v1";
const KEY_BACKUP_HANDLE = "backup-handle-v1";

// ---------- IndexedDB minimal ----------
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet<T>(key: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.get(key);
    req.onsuccess = () => resolve((req.result as T) ?? null);
    req.onerror = () => reject(req.error);
  });
}
async function idbSet<T>(key: string, value: T): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.put(value as any, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
async function idbDel(key: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ---------- Persistencia de almacenamiento (menor riesgo de borrado por el sistema) ----------
export async function requestPersistentStorage(): Promise<boolean> {
  if (navigator.storage && "persist" in navigator.storage) {
    // @ts-ignore - tipos de TS varían según versión
    return await navigator.storage.persist();
  }
  return false;
}

// ---------- API de alto nivel para canciones ----------
export async function loadSongs(): Promise<Song[] | null> {
  // Primero intenta en IndexedDB
  const fromIDB = await idbGet<Song[]>(KEY_SONGS);
  if (fromIDB && Array.isArray(fromIDB)) return fromIDB;

  // Compatibilidad con versiones previas (localStorage)
  const legacy = localStorage.getItem("church-songs");
  if (legacy) {
    try {
      const parsed = JSON.parse(legacy) as Song[];
      await idbSet(KEY_SONGS, parsed);
      return parsed;
    } catch {}
  }
  return null; // que el caller decida sembrar defaultSongs
}

export async function saveSongs(songs: Song[]): Promise<void> {
  await idbSet(KEY_SONGS, songs);
  // cache de compatibilidad
  localStorage.setItem("church-songs", JSON.stringify(songs));
  // guarda también en archivo si está configurado
  await saveBackupIfConfigured(songs);
}

// ---------- Export/Import manual ----------
export function exportSongsAsFile(songs: Song[], filename = "cancionero.json") {
  const blob = new Blob([JSON.stringify(songs, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importSongsFromFile(file: File): Promise<Song[]> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) throw new Error("Archivo inválido");
  return parsed as Song[];
}

// ---------- Respaldo automático en archivo ----------
type FileHandle = any; // usar lib DOM para tipos nativos si tu TS los trae (FileSystemFileHandle)

async function verifyPermission(handle: FileHandle, mode: "read" | "readwrite") {
  if (!handle) return false;
  if (handle.queryPermission && handle.requestPermission) {
    // @ts-ignore
    const q = await handle.queryPermission({ mode });
    if (q === "granted") return true;
    // @ts-ignore
    const r = await handle.requestPermission({ mode });
    return r === "granted";
  }
  return false;
}

export async function configureBackupFile(suggestedName = "cancionero.json") {
  // Requiere Chrome/Edge, en Safari aún limitado
  // @ts-ignore
  if (!window.showSaveFilePicker) throw new Error("Tu navegador no soporta guardar directo en archivo.");
  // @ts-ignore
  const handle: FileHandle = await window.showSaveFilePicker({
    suggestedName,
    types: [{ description: "JSON", accept: { "application/json": [".json"] } }],
  });
  if (!(await verifyPermission(handle, "readwrite"))) {
    throw new Error("Permiso denegado para escribir el archivo de respaldo.");
  }
  await idbSet(KEY_BACKUP_HANDLE, handle); // los handles se pueden clonar en IDB
}

export async function saveBackupIfConfigured(songs: Song[]) {
  const handle = await idbGet<FileHandle>(KEY_BACKUP_HANDLE);
  if (!handle) return;
  try {
    if (!(await verifyPermission(handle, "readwrite"))) return;
    const writable = await handle.createWritable();
    await writable.write(new Blob([JSON.stringify(songs, null, 2)], { type: "application/json" }));
    await writable.close();
  } catch (e) {
    console.warn("No se pudo escribir el respaldo automático:", e);
  }
}

export async function loadFromBackupFile(): Promise<Song[] | null> {
  const handle = await idbGet<FileHandle>(KEY_BACKUP_HANDLE);
  if (!handle) return null;
  try {
    if (!(await verifyPermission(handle, "read"))) return null;
    const file = await handle.getFile();
    const text = await file.text();
    const arr = JSON.parse(text);
    if (Array.isArray(arr)) return arr as Song[];
  } catch (e) {
    console.warn("No se pudo leer el archivo de respaldo:", e);
  }
  return null;
}

export async function disconnectBackupFile() {
  await idbDel(KEY_BACKUP_HANDLE);
}
