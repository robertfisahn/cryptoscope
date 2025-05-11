import { defineStore } from 'pinia';
import { coinApi } from 'src/api/coinApi';
import type { TimeRange } from 'src/models/TimeRange';
import { DEFAULT_TIME_RANGE } from 'src/models/TimeRange';
import type { MarketChartData } from 'src/models/MarketChartData';
import { reactive } from 'vue';

export const useCoinChartStore = defineStore('coinChart', () => {
    const charts = reactive<Record<string, { data: MarketChartData; lastUpdated: number }>>({});

    async function fetchCoinChart(id: string, days: TimeRange = DEFAULT_TIME_RANGE) {
      const now = Date.now();
      const key = `${id}_${days}`;
      const cached = charts[key];

      if (cached && loadFromCache(cached.lastUpdated)) {
        console.log(`[CoinChartStore] Using cached chart for ${id} (${days}d)`);
        return cached.data;
      }

      console.log(`[CoinChartStore] Fetching new chart for ${id} (${days}d)`);
      const res = await coinApi.getCoinMarketChart(id, days);

      charts[key] = {
        data: res.data,
        lastUpdated: now
      };
      return res.data;
    }

    function loadFromCache(lastUpdated: number): boolean {
      const now = Date.now();
      return now - lastUpdated < 5 * 60 * 1000;
    }

    return { charts, fetchCoinChart };
  }
);
