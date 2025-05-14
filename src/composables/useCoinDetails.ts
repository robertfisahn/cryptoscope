import { useCoinDetailsStore } from 'src/stores/coinDetailsStore';
import { ref, onMounted } from 'vue';
import type { CoinDetails } from 'src/models/CoinDetails';
import { logger } from 'src/utils/logger';

export function useCoinDetails(id: string) {
  const store = useCoinDetailsStore();
  const coin = ref<CoinDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function loadCached() {
    const cached = store.getCachedCoin(id);
    if (cached) {
      coin.value = cached;
      logger.debug(`[useCoinDetails] Loaded cached data for ${id}`);
    } else {
      logger.debug(`[useCoinDetails] No cache for ${id}`);
    }
  }

  async function refreshIfNeeded() {
    if (!store.shouldRefresh(id)) {
      logger.debug(`[useCoinDetails] No refresh needed for ${id}`);
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      logger.info(`[useCoinDetails] Refreshing data for ${id}...`);
      const fresh = await store.refreshCoinDetails(id);
      coin.value = fresh;
      logger.debug(`[useCoinDetails] Refreshed data set for ${id}`);
    } catch (err) {
      logger.error(`[useCoinDetails] Failed to refresh data for ${id}:`, err);
      error.value = 'Failed to refresh coin details';
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadCached();
    void refreshIfNeeded();
  });

  return { coin, loading, error };
}
