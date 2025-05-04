import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { CoinDetails } from 'src/models/CoinDetails';

export const useCoinDetailsStore = defineStore('coinDetails', {
  state: () => ({
    coinDetails: {} as Record<string, { data: CoinDetails; lastUpdated: number; lastAccessed: number }>
  }),

  actions: {
    async fetchCoinDetails(id: string) {
      const now = Date.now();
      const cached = this.coinDetails[id];

      if (cached) {
        cached.lastAccessed = now;
        if (now - cached.lastUpdated < 2 * 60 * 1000) {
          console.log(`[CoinDetailsStore] Using cached details for ${id}`);
          return cached.data;
        }
        console.log(`[CoinDetailsStore] Cache expired for ${id}, fetching new data`);
      } else {
        console.log(`[CoinDetailsStore] No cache for ${id}, fetching from API`);
      }

      const res = await coinApi.getCoinDetails(id);
      
      console.log('[CoinDetailsStore] API response:', res.data);
      this.coinDetails[id] = {
        data: res.data,
        lastUpdated: now,
        lastAccessed: now
      };
      return res.data;
    }
  }
});
