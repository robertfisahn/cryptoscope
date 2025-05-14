import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { CoinDetails } from 'src/models/CoinDetails';
import { reactive } from 'vue';

export const useCoinDetailsStore = defineStore('coinDetails', () => {
    const coinDetails = reactive<Record<string, { data: CoinDetails; lastUpdated: number}>> ({});

    function getCachedCoin(id: string): CoinDetails | null {
      const cached = coinDetails[id];
      if (!cached) return null;
      console.log(`[CoinDetailsStore] Using cached data details for ${id}`);
      return cached.data;
    }
    
    function shouldRefresh(id: string): boolean {
      const cached = coinDetails[id];
      if (!cached) return true;
      return Date.now() - cached.lastUpdated > 2 * 60 * 1000;
    }
    
    async function refreshCoinDetails(id: string): Promise<CoinDetails> {
      const now = Date.now();
      const res = await coinApi.getCoinDetails(id);
    
      coinDetails[id] = {
        data: res.data,
        lastUpdated: now
      };
      return res.data;
    }

    return { coinDetails, getCachedCoin, shouldRefresh, refreshCoinDetails }
  }
);
