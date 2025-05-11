import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { CoinListItem } from 'src/models/CoinListItem';
import { reactive, ref } from 'vue';

const CACHE_KEY = 'coin_list_cache'

export const useCoinListStore = defineStore('coinList', () => {
    const coins = reactive<CoinListItem[]>([]);
    const lastUpdated = ref<string | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const refreshInterval = ref<number | null>(null);

    async function fetchCoins(force = false) {
      if (loadFromCache() && !force) {
        console.log('[CoinListStore] Loaded coins from cache.') 
        return
      }

      loading.value = true;
      error.value = null;

      try {
        const res = await coinApi.getCoins();
        coins.length = 0
        coins.push(...res.data)
        lastUpdated.value = new Date().toLocaleTimeString();
        
        console.log('[CoinListStore] Fetching coins from API...');

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          coins: coins,
          lastUpdated: lastUpdated.value
        }));
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('API error:', errorMessage);
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
      if (refreshInterval.value) return;

      refreshInterval.value = window.setInterval(() => {
        void fetchCoins(true)
      }, intervalMs)
      console.log(`[CoinListStore] Auto refresh started)`);
    }

    return { 
      coins, 
      lastUpdated, 
      loading, 
      error, 
      refreshInterval, 
      fetchCoins, 
      startAutoRefresh 
    }
  }
);
