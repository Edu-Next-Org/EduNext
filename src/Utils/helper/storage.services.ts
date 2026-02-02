type StorageKey = string;


const setItem = <T>(key: StorageKey, value: T): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
};


const getItem = <T>(key: StorageKey): T | false => {
  if (typeof window === "undefined") return false;

  const item = localStorage.getItem(key);
  if (!item) return false;

  try {
    return JSON.parse(item) as T;
  } catch {
    return false;
  }
};


const getItemGeneric = (key: StorageKey): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
};

const setItemGeneric = (key: StorageKey, value: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, value);
};


const removeItem = (key: StorageKey): boolean => {
  if (typeof window === "undefined") return false;

  const exists = localStorage.getItem(key);
  if (!exists) return false;

  localStorage.removeItem(key);
  return true;
};


const clearStorages = (): void => {
  if (typeof window === "undefined") return;
  localStorage.clear();
};

export {
  setItem,
  getItem,
  getItemGeneric,
  setItemGeneric,
  removeItem,
  clearStorages,
};