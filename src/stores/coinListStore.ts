import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { CoinListItem } from 'src/models/CoinListItem';

const CACHE_KEY = 'crypto_cache'

export const useCoinListStore = defineStore('coinList', {
  state: () => ({
    coins: [] as CoinListItem[],
    lastUpdated: null as string | null,
    loading: false,
    error: null as string | null,
    refreshInterval: null as number | null
  }),

  actions: {
    async fetchCoins(force = false) {
      if (this.coins.length > 0 && !force) return;

      this.loading = true;
      this.error = null;

      try {
        const res = await coinApi.getCoins();
        this.coins = res.data;
        this.lastUpdated = new Date().toLocaleTimeString();

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          coins: this.coins,
          lastUpdated: this.lastUpdated
        }));
        
        console.log('[CoinListStore] Fetching coins from API...');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('API error:', errorMessage);
        this.error = 'Failed to load top coins.';
      } finally {
        this.loading = false;
      }
    },

    loadFromCache() {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { coins, lastUpdated } = JSON.parse(cached)
        this.coins = coins
        this.lastUpdated = lastUpdated
        console.log('[CoinListStore] Loaded coins from cache.');
      }
    },

    startAutoRefresh(intervalMs = 20000) {
      if (this.refreshInterval) return
      this.refreshInterval = window.setInterval(() => {
        void this.fetchCoins(true)
      }, intervalMs)
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    }
  }
});
