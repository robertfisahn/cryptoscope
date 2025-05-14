import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { CoinDetails } from 'src/models/CoinDetails';
import { reactive } from 'vue';
import { logger } from 'src/utils/logger';

export const useCoinDetailsStore = defineStore('coinDetails', () => {
  const coinDetails = reactive<Record<string, { data: CoinDetails; lastUpdated: number }>>({});

  function getCachedCoin(id: string): CoinDetails | null {
    const cached = coinDetails[id];
    if (!cached) return null;

    logger.debug(`[CoinDetailsStore] Using cached data for ${id}`);
    return cached.data;
  }

  function shouldRefresh(id: string): boolean {
    const cached = coinDetails[id];
    if (!cached) {
      logger.debug(`[CoinDetailsStore] No cache for ${id} – will fetch`);
      return true;
    }

    const age = Date.now() - cached.lastUpdated;
    const expired = age > 2 * 60 * 1000;
    logger.debug(`[CoinDetailsStore] Cache age for ${id}: ${Math.round(age / 1000)}s → ${expired ? 'EXPIRED' : 'VALID'}`);
    return expired;
  }

  async function refreshCoinDetails(id: string): Promise<CoinDetails> {
    const now = Date.now();

    logger.info(`[CoinDetailsStore] Fetching new data for ${id} from API`);
    const res = await coinApi.getCoinDetails(id);

    coinDetails[id] = {
      data: res.data,
      lastUpdated: now
    };

    logger.debug(`[CoinDetailsStore] Data for ${id} saved to cache`);

    return res.data;
  }

  return { coinDetails, getCachedCoin, shouldRefresh, refreshCoinDetails };
});
