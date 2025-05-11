import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { CoinDetails } from 'src/models/CoinDetails';
import { reactive } from 'vue';

export const useCoinDetailsStore = defineStore('coinDetails', () => {
    const coinDetails = reactive<Record<string, { data: CoinDetails; lastUpdated: number; lastAccessed: number }>> ({});

    async function fetchCoinDetails(id: string) {
      const now = Date.now();
      const cached = coinDetails[id];

      if (cached && loadFromCache(cached.lastUpdated)) {
        cached.lastAccessed = now;
        console.log(`[CoinDetailsStore] Using cached details for ${id}`);
        return cached.data;
      }
      const res = await coinApi.getCoinDetails(id);
      
      console.log('[CoinDetailsStore] Fetching new data from API...');

      coinDetails[id] = {
        data: res.data,
        lastUpdated: now,
        lastAccessed: now
      };
      return res.data;
    }

    function loadFromCache(lastUpdated: number): boolean {
      return Date.now() - lastUpdated < 2 * 60 * 1000;
    }

    return { coinDetails, fetchCoinDetails }
  }
);
