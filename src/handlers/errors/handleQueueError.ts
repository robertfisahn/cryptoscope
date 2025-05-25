import type { ApiError } from 'src/models/ApiError';
import { logger } from 'src/utils/logger';
import { pauseQueue, resumeQueue } from 'src/utils/queue';
import { useCoinListStore } from 'src/stores/coinListStore';
import { useSearchStore } from 'src/stores/searchStore';
import type { Task } from 'src/models/Task';

export function handleQueueError(err: unknown, task: Task<unknown>, requeue: (task: Task<unknown>) => void) {
  if (err as ApiError) {
    logger.warn(`[Queue] ⏸️ Rate limited – pausing and requeueing task: ${task.label}`);
    pauseQueue();
    useCoinListStore().stopAutoRefresh();
    useSearchStore().stopAutoRefresh();
    requeue(task);

    const tryResume = () => {
      if (navigator.onLine) {
        logger.info('[Queue] ▶️ Resuming after rate limit (online)');
        resumeQueue();
        useCoinListStore().restartAutoRefreshIfSet();
        useSearchStore().restartAutoRefreshIfSet();
      } else {
        logger.info('[Queue] ⏳ Still offline after rate limit – will retry in 30s');
        setTimeout(tryResume, 30_000);
      }
    };

    setTimeout(tryResume, 30_000);
    return;
  }

  logger.error(`[Queue] ❌ Unhandled task error: ${task.label}`, err);
  task.reject(err);
}
