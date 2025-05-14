import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { TimeRange } from 'src/models/TimeRange';
import { DEFAULT_TIME_RANGE } from 'src/models/TimeRange';
import type { MarketChartData } from 'src/models/MarketChartData';
import { reactive } from 'vue';
import { logger } from 'src/utils/logger';

export const useCoinChartStore = defineStore('coinChart', () => {
  const charts = reactive<Record<string, { data: MarketChartData; lastUpdated: number }>>({});

  function getCachedChart(id: string, days: TimeRange = DEFAULT_TIME_RANGE) {
    const key = `${id}_${days}`;
    const cached = charts[key];
    if (!cached) return null;

    logger.debug(`[CoinChartStore] Using cached chart for ${id} (${days}d)`);
    return cached.data;
  }

  function shouldRefresh(id: string, days: TimeRange = DEFAULT_TIME_RANGE): boolean {
    const key = `${id}_${days}`;
    const cached = charts[key];
    if (!cached) {
      logger.debug(`[CoinChartStore] No cache for ${id} (${days}d) – will fetch`);
      return true;
    }

    const expired = Date.now() - cached.lastUpdated > 5 * 60 * 1000;
    logger.debug(`[CoinChartStore] Cache age for ${id} (${days}d): ${Math.round((Date.now() - cached.lastUpdated) / 1000)}s → ${expired ? 'EXPIRED' : 'VALID'}`);
    return expired;
  }

  async function refreshCoinChart(id: string, days: TimeRange = DEFAULT_TIME_RANGE) {
    const now = Date.now();
    const key = `${id}_${days}`;

    logger.info(`[CoinChartStore] Fetching new chart for ${id} (${days}d)`);

    const res = await coinApi.getCoinMarketChart(id, days);

    charts[key] = {
      data: res.data,
      lastUpdated: now
    };

    logger.debug(`[CoinChartStore] Chart data saved to cache for ${id} (${days}d)`);

    return res.data;
  }

  return { charts, refreshCoinChart, getCachedChart, shouldRefresh };
});
