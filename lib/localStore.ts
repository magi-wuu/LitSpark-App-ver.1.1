export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}
export interface StorageSnapshot<T> {
  data: T;
  loaded: boolean;
  saving: boolean;
  dirty: boolean;
  error: 'load' | 'save' | null;
}

/** Reads before allowing edits, serializes writes, and retains failed edits for retry. */
export class LocalStore<T> {
  private snapshot: StorageSnapshot<T>;
  private listeners = new Set<() => void>();
  private loading: Promise<void> | null = null;
  private queue: Promise<void> = Promise.resolve();
  private revision = 0;

  constructor(private key: string, initial: T, private decode: (value: unknown) => T, private storage: StorageAdapter) {
    this.snapshot = { data: initial, loaded: false, saving: false, dirty: false, error: null };
  }
  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => { this.listeners.delete(listener); };
  };
  private publish(patch: Partial<StorageSnapshot<T>>) {
    this.snapshot = { ...this.snapshot, ...patch };
    this.listeners.forEach(listener => listener());
  }
  load = (): Promise<void> => {
    if (this.snapshot.loaded) return Promise.resolve();
    if (this.loading) return this.loading;
    this.publish({ error: null });
    this.loading = this.read().finally(() => { this.loading = null; });
    return this.loading;
  };
  private async read() {
    try {
      const raw = await this.storage.getItem(this.key);
      const data = raw === null ? this.snapshot.data : this.decode(JSON.parse(raw));
      this.publish({ data, loaded: true, error: null });
    } catch {
      // Do not overwrite unreadable or temporarily inaccessible saved data with defaults.
      this.publish({ error: 'load', loaded: false });
    }
  }
  update = (updater: (current: T) => T): Promise<void> => {
    if (!this.snapshot.loaded) return Promise.reject(new Error('Saved data has not loaded.'));
    const next = updater(this.snapshot.data);
    if (next === this.snapshot.data) return this.flush();
    this.revision++;
    this.publish({ data: next, dirty: true, saving: true, error: null });
    return this.persist(next, this.revision);
  };
  private persist(data: T, revision: number) {
    const task = this.queue.catch(() => {}).then(async () => {
      try {
        await this.storage.setItem(this.key, JSON.stringify(data));
        if (revision === this.revision) this.publish({ saving: false, dirty: false, error: null });
      } catch (error) {
        if (revision === this.revision) this.publish({ saving: false, dirty: true, error: 'save' });
        throw error;
      }
    });
    this.queue = task;
    // Keep failures observable to callers without creating unhandled rejections in event handlers.
    void task.catch(() => {});
    return task;
  }
  retry = (): Promise<void> => {
    if (!this.snapshot.loaded) return this.load();
    if (!this.snapshot.dirty) return Promise.resolve();
    this.publish({ saving: true, error: null });
    return this.persist(this.snapshot.data, this.revision);
  };
  flush = () => this.snapshot.error === 'save' ? this.retry() : this.queue;
}
