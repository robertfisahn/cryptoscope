import { Notify } from 'quasar';
import { pauseQueue, resumeQueue } from './queue';
import { logger } from './logger';
import { useCoinListStore } from 'src/stores/coinListStore';
import { useSearchStore } from 'src/stores/searchStore';

let isOffline = false;

export function setupNetworkListener() {
  const coinListStore = useCoinListStore();
  const searchStore = useSearchStore();

  window.addEventListener('online', () => {
    if (isOffline) {
      isOffline = false;
      logger.network('[Network] Back online');
      resumeQueue();
      coinListStore.restartAutoRefreshIfSet();
      searchStore.restartAutoRefreshIfSet();
      Notify.create({
        type: 'positive',
        message: 'You are back online'
      });
    }
  });

  window.addEventListener('offline', handleOffline);
  
  function handleOffline() {
    isOffline = true;
    logger.network('[Network] Offline');
    pauseQueue();
    coinListStore.stopAutoRefresh();
    searchStore.stopAutoRefresh();
    Notify.create({
      type: 'warning',
      message: 'You are offline'
    });
  }

  if (!navigator.onLine) handleOffline();

}
