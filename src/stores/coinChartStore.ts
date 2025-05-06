import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { TimeRange } from 'src/models/TimeRange';
import { DEFAULT_TIME_RANGE } from 'src/models/TimeRange';
import type { MarketChartData } from 'src/models/MarketChartData';

export const useCoinChartStore = defineStore('coinChart', {
  state: () => ({
    charts: {} as Record<string, { data: MarketChartData; lastUpdated: number }>
  }),

  actions: {
    async fetchCoinChart(id: string, days: TimeRange = DEFAULT_TIME_RANGE) {
      const now = Date.now();
      const key = `${id}_${days}`;
      const cached = this.charts[key];

      if (cached && now - cached.lastUpdated < 5 * 60 * 1000) {
        console.log(`[CoinChartStore] Using cached chart for ${id} (${days}d)`);
        return cached.data;
      }

      console.log(`[CoinChartStore] Fetching new chart for ${id} (${days}d)`);
      const res = await coinApi.getCoinMarketChart(id, days);

      this.charts[key] = {
        data: res.data,
        lastUpdated: now
      };

      return res.data;
    }
  }
});
