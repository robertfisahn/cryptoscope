import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { CoinListItem } from 'src/models/CoinListItem';
import { reactive, ref } from 'vue';
import { logger } from 'src/utils/logger';

const CACHE_KEY = 'coin_list_cache';

export const useCoinListStore = defineStore('coinList', () => {
  const coins = reactive<CoinListItem[]>([]);
  const lastUpdated = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const refreshInterval = ref<number | null>(null);
  const autoRefreshMs = ref<number | null>(null);

  async function fetchCoins(force = false) {
    if (loadFromCache() && !force) {
      logger.debug('[CoinListStore] Loaded coins from cache.');
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const res = await coinApi.getCoins();
      coins.length = 0;
      coins.push(...res.data);
      lastUpdated.value = new Date().toLocaleTimeString();

      logger.info('[CoinListStore] Fetched coins from API.');

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        coins: coins,
        lastUpdated: lastUpdated.value
      }));

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error('[CoinListStore] API error:', errorMessage);
      error.value = 'Failed to load top coins.';
    } finally {
      loading.value = false;
    }
  }

  function loadFromCache(): boolean {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return false;

    const { coins: cachedCoins, lastUpdated: cachedLastUpdated } = JSON.parse(cached);
    coins.length = 0;
    coins.push(...cachedCoins);
    lastUpdated.value = cachedLastUpdated;
    return true;
  }

  function startAutoRefresh(intervalMs: number) {
    stopAutoRefresh();
    autoRefreshMs.value = intervalMs;
    refreshInterval.value = window.setInterval(() => {
      void fetchCoins(true);
    }, intervalMs);

    logger.debug('[CoinListStore] Auto refresh started');
  }

  function stopAutoRefresh() {
    if (refreshInterval.value) {
      clearInterval(refreshInterval.value);
      refreshInterval.value = null;
      logger.debug('[CoinListStore] Auto refresh stopped');
    }
  }

  function restartAutoRefreshIfSet() {
    if (autoRefreshMs.value) {
      startAutoRefresh(autoRefreshMs.value);
    }
  }

  return {
    coins,
    lastUpdated,
    loading,
    error,
    refreshInterval,
    fetchCoins,
    startAutoRefresh,
    stopAutoRefresh,
    restartAutoRefreshIfSet
  };
});
