export interface QueueOptions {
  priority?: 'low' | 'high';
  taskId?: string;
  cancelKey?: string;
}