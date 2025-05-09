import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { SearchCoin } from 'src/models/SearchCoin';

const CACHE_KEY = 'search_coins_cache';

export const useSearchStore = defineStore('search', {
  state: () => ({
    coins: [] as SearchCoin[],
    loading: false,
    lastFetched: null as number | null,
    refreshInterval: null as number | null
  }),

  actions: {
    async fetchCoinsList(force = false) {
      if (this.coins.length > 0 && !force) {
        const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
          const { coins, lastFetched } = JSON.parse(cached);
          this.coins = coins;
          this.lastFetched = lastFetched;
          console.log('[SearchStore] Loaded coins from cache.');
          return;
        }
      }

      this.loading = true;
      try {
        const res = await coinApi.getSearchList();
        this.coins = res.data;
        this.lastFetched = Date.now();

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          coins: this.coins,
          lastFetched: this.lastFetched
        }));

        console.log('[SearchStore] Fetched coins from API.');
      } catch (err) {
        console.error('Error fetching coins list:', err);
      } finally {
        this.loading = false;
      }
    },

    startAutoRefresh(intervalMs: number) {
      if (this.refreshInterval) return;
      this.refreshInterval = window.setInterval(() => {
        void this.fetchCoinsList(true);
      }, intervalMs);
      console.log(`[SearchStore] Auto refresh started (interval: ${intervalMs} ms)`);
    },
  }
});
