import { useState, useEffect, useCallback } from "react";

const DB_NAME = "woofur-offline-db";
const DB_VERSION = 1;

interface OfflineStore {
  animals: any[];
  favorites: string[];
  bookings: any[];
  stories: any[];
  lastSync: number;
}

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create stores if they don't exist
      if (!db.objectStoreNames.contains("animals")) {
        db.createObjectStore("animals", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("favorites")) {
        db.createObjectStore("favorites", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("bookings")) {
        db.createObjectStore("bookings", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("stories")) {
        db.createObjectStore("stories", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("pendingSync")) {
        db.createObjectStore("pendingSync", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "key" });
      }
    };
  });
};

export const useOfflineData = () => {
  const [isReady, setIsReady] = useState(false);
  const [db, setDb] = useState<IDBDatabase | null>(null);

  useEffect(() => {
    openDatabase()
      .then((database) => {
        setDb(database);
        setIsReady(true);
      })
      .catch((error) => {
        console.error("Failed to open IndexedDB:", error);
        setIsReady(true); // Still mark as ready to allow app to function
      });

    return () => {
      db?.close();
    };
  }, []);

  const saveToStore = useCallback(
    async <T extends { id: string }>(storeName: string, data: T | T[]): Promise<void> => {
      if (!db) return;

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);

        if (Array.isArray(data)) {
          data.forEach((item) => store.put(item));
        } else {
          store.put(data);
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    },
    [db]
  );

  const getFromStore = useCallback(
    async <T>(storeName: string, id?: string): Promise<T | T[] | null> => {
      if (!db) return null;

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);

        if (id) {
          const request = store.get(id);
          request.onsuccess = () => resolve(request.result as T);
          request.onerror = () => reject(request.error);
        } else {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result as T[]);
          request.onerror = () => reject(request.error);
        }
      });
    },
    [db]
  );

  const deleteFromStore = useCallback(
    async (storeName: string, id: string): Promise<void> => {
      if (!db) return;

      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
    [db]
  );

  const addToPendingSync = useCallback(
    async (action: { type: string; data: any; timestamp: number }): Promise<void> => {
      if (!db) return;

      return new Promise((resolve, reject) => {
        const transaction = db.transaction("pendingSync", "readwrite");
        const store = transaction.objectStore("pendingSync");
        const request = store.add(action);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    },
    [db]
  );

  const getPendingSync = useCallback(async (): Promise<any[]> => {
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("pendingSync", "readonly");
      const store = transaction.objectStore("pendingSync");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  const clearPendingSync = useCallback(async (): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("pendingSync", "readwrite");
      const store = transaction.objectStore("pendingSync");
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  const updateLastSync = useCallback(async (): Promise<void> => {
    if (!db) return;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("meta", "readwrite");
      const store = transaction.objectStore("meta");
      const request = store.put({ key: "lastSync", value: Date.now() });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  const getLastSync = useCallback(async (): Promise<number | null> => {
    if (!db) return null;

    return new Promise((resolve, reject) => {
      const transaction = db.transaction("meta", "readonly");
      const store = transaction.objectStore("meta");
      const request = store.get("lastSync");

      request.onsuccess = () => resolve(request.result?.value ?? null);
      request.onerror = () => reject(request.error);
    });
  }, [db]);

  return {
    isReady,
    saveToStore,
    getFromStore,
    deleteFromStore,
    addToPendingSync,
    getPendingSync,
    clearPendingSync,
    updateLastSync,
    getLastSync,
  };
};
