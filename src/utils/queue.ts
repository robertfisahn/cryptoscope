import { logger } from 'src/utils/logger';
import type { Task } from 'src/models/Task';
import type { QueueOptions } from 'src/models/QueueOptions'

const taskQueue: Task<unknown>[] = [];
const INTERVAL_MS = 10000;
const activeTaskIds = new Set<string>();

function startQueueProcessor() {
  setInterval(() => {
    void (async () => {
      if (taskQueue.length === 0) return;

      const task = taskQueue.shift();
      if (!task) return;

      try {
        const result = await task.run();
        logger.info(`[Queue] ✅ Task completed: ${task.label}`);
        task.resolve(result);
      } catch (err) {
        logger.error(`[Queue] ❌ Task failed: ${task.label}`, err);
        task.reject(err);
      }
    })();
  }, INTERVAL_MS);
}

let started = false;

export function enqueueRequest<T>(
  run: () => Promise<T>,
  label = 'anonymous task',
  options: QueueOptions = {}
): Promise<T> {
  if (!started) {
    startQueueProcessor();
    started = true;
  }

  const { 
    priority = 'low', 
    taskId = `${label}::${priority}`, 
    cancelKey
  } = options;

  if (activeTaskIds.has(taskId)) {
    logger.warn(`[Queue] ❌ Duplicate task skipped: ${taskId}`);
    return Promise.reject(new Error('Duplicate task in queue'));
  }

  activeTaskIds.add(taskId);
  logger.debug(`[Queue] Enqueuing task: ${label} [priority: ${priority}]`);

  return new Promise<T>((resolve, reject) => {
    const task: Task<T> = {
      label,
      taskId,
      run,
      resolve: (value) => {
        activeTaskIds.delete(taskId);
        resolve(value);
      },
      reject: (error) => {
        activeTaskIds.delete(taskId);
        reject(error instanceof Error ? error : new Error(String(error)));
      },
      priority,
      ...(cancelKey ? { cancelKey } : {})
    };
    
    if (priority === 'high') {
      taskQueue.unshift(task as Task<unknown>);
      logger.debug(`[Queue] High-priority task inserted first: ${label}`);
    } else {
      taskQueue.push(task as Task<unknown>);
      logger.debug(`[Queue] Low-priority task added: ${label}`);
    }

    logger.info('[Queue] Current queue state:', taskQueue.map(task => ({
      label: task.label,
      priority: task.priority,
      taskId: task.taskId,
      cancelKey: task.cancelKey
    })));
  });
}

export function cancelRequestsByKey(key: string) {
  const initialLength = taskQueue.length;

  for (let i = taskQueue.length - 1; i >= 0; i--) {
    const task = taskQueue[i];
    if (task?.cancelKey === key) {
      logger.info(`[Queue] 🛑 Cancelling task: ${task.label}`);
      activeTaskIds.delete(task.taskId);
      taskQueue.splice(i, 1);
    }
  }

  const removed = initialLength - taskQueue.length;
  if (removed > 0) {
    logger.debug(`[Queue] Removed ${removed} task(s) with cancelKey: ${key}`);
  }
}
