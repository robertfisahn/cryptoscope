import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { TimeRange } from 'src/models/TimeRange';
import { DEFAULT_TIME_RANGE } from 'src/models/TimeRange';
import type { MarketChartData } from 'src/models/MarketChartData';
import { reactive } from 'vue';

export const useCoinChartStore = defineStore('coinChart', () => {
    const charts = reactive<Record<string, { data: MarketChartData; lastUpdated: number }>>({});

    function getCachedChart(id: string, days: TimeRange = DEFAULT_TIME_RANGE) {
      const key = `${id}_${days}`;
      const cached = charts[key];
      if (!cached) return null;
      console.log(`[CoinChartStore] Using cached chart for ${id} (${days}d)`);
      return cached.data;
    }

    function shouldRefresh(id: string, days: TimeRange = DEFAULT_TIME_RANGE): boolean {
      const key = `${id}_${days}`;
      const cached = charts[key];
      if (!cached) return true;
      return Date.now() - cached.lastUpdated > 5 * 60 * 1000;
    }

    async function refreshCoinChart(id: string, days: TimeRange = DEFAULT_TIME_RANGE) {
      const now = Date.now();
      const key = `${id}_${days}`;

      console.log(`[CoinChartStore] Fetching new chart for ${id} (${days}d)`);
      const res = await coinApi.getCoinMarketChart(id, days);

      charts[key] = {
        data: res.data,
        lastUpdated: now
      };
      return res.data;
    }

    return { charts, refreshCoinChart , getCachedChart, shouldRefresh};
  }
);
