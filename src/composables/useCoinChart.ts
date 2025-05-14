import { ref, watch } from 'vue';
import { useCoinChartStore } from 'src/stores/coinChartStore';
import type { ChartData } from 'chart.js';
import type { TimeRange } from 'src/models/TimeRange';
import { DEFAULT_TIME_RANGE } from 'src/models/TimeRange';
import { logger } from 'src/utils/logger';

interface PricePoint {
  x: Date;
  y: number;
}

export function useCoinChart(coinId: string) {
  const chartStore = useCoinChartStore();
  const chartData = ref<ChartData<'line'> | null>(null);
  const loading = ref(false);
  const range = ref<TimeRange>(DEFAULT_TIME_RANGE);

  function loadCachedChart() {
    const cached = chartStore.getCachedChart(coinId, range.value);
    if (!cached) {
      logger.debug(`[useCoinChart] No cached chart for ${coinId} (${range.value}d)`);
      return;
    }

    logger.debug(`[useCoinChart] Loaded cached chart for ${coinId} (${range.value}d)`);

    const prices = cached.prices.map((item: [number, number]): PricePoint => ({
      x: new Date(item[0]),
      y: item[1]
    }));

    chartData.value = {
      labels: prices.map((p) => p.x.toLocaleDateString()),
      datasets: [{
        label: 'Price (USD)',
        data: prices.map((p) => p.y),
        borderColor: 'blue',
        fill: false
      }]
    };
  }

  async function refreshChartIfNeeded() {
    if (!chartStore.shouldRefresh(coinId, range.value)) {
      logger.debug(`[useCoinChart] No refresh needed for ${coinId} (${range.value}d)`);
      return;
    }

    logger.info(`[useCoinChart] Refreshing chart for ${coinId} (${range.value}d)`);
    loading.value = true;
    try {
      const fresh = await chartStore.refreshCoinChart(coinId, range.value);

      const prices = fresh.prices.map((item: [number, number]): PricePoint => ({
        x: new Date(item[0]),
        y: item[1]
      }));

      chartData.value = {
        labels: prices.map((p: PricePoint) => p.x.toLocaleDateString()),
        datasets: [{
          label: 'Price (USD)',
          data: prices.map((p: PricePoint) => p.y),
          borderColor: 'blue',
          fill: false
        }]
      };
    } catch (err) {
      logger.error('[useCoinChart] Chart refresh error:', err);
    } finally {
      loading.value = false;
    }
  }

  watch(range, () => {
    loadCachedChart(); 
    void refreshChartIfNeeded();
  }, { immediate: true });

  return { chartData, loading, range };
}
