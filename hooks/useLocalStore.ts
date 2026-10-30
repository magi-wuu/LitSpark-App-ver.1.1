import { useEffect, useState, useSyncExternalStore } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LocalStore } from '../lib/localStore';

export function useLocalStore<T>(key: string, defaults: T, decode: (value: unknown) => T) {
  const [store] = useState(() => new LocalStore(key, defaults, decode, AsyncStorage));
  const snapshot = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
  useEffect(() => { void store.load(); }, [store]);
  return { ...snapshot, update: store.update, retry: store.retry, flush: store.flush };
}
