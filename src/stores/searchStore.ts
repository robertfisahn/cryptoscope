import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { SearchCoin } from 'src/models/SearchCoin';
import { reactive, ref } from 'vue';
import { logger } from 'src/utils/logger';

const CACHE_KEY = 'search_coins_cache';

export const useSearchStore = defineStore('search', () => {
  const coins = reactive<SearchCoin[]>([]);
  const loading = ref(false);
  const lastUpdated = ref<number | null>(null);
  const refreshInterval = ref<number | null>(null);

  async function fetchSearchCoins(force = false) {
    if (loadFromCache() && !force) {
      logger.debug('[SearchStore] Loaded coins from cache.');
      return;
    }

    loading.value = true;
    try {
      const res = await coinApi.getSearchList();
      coins.length = 0;
      coins.push(...res.data);
      lastUpdated.value = Date.now();

      localStorage.setItem(CACHE_KEY, JSON.stringify({
        coins: coins,
        lastUpdated: lastUpdated.value
      }));

      logger.info('[SearchStore] Fetched coins from API.');
    } catch (err) {
      logger.error('[SearchStore] Error fetching coins list:', err);
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
    if (refreshInterval.value) return;
    refreshInterval.value = window.setInterval(() => {
      void fetchSearchCoins(true);
    }, intervalMs);

    logger.debug('[SearchStore] Auto refresh started');
  }

  return {
    coins,
    loading,
    lastUpdated,
    refreshInterval,
    fetchSearchCoins,
    startAutoRefresh
  };
});
