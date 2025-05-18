export type Task<T> = {
  label: string;
  run: () => Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
  priority: 'low' | 'high';
  taskId: string;
  cancelKey?: string;
};