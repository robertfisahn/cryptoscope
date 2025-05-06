import { ref, watch } from 'vue';
import { useCoinChartStore } from 'src/stores/coinChartStore';
import type { ChartData } from 'chart.js';
import type { TimeRange } from 'src/models/TimeRange';
import { DEFAULT_TIME_RANGE } from 'src/models/TimeRange';

interface PricePoint {
  x: Date;
  y: number;
}

export function useCoinChart(coinId: string) {
  const chartStore = useCoinChartStore();
  const chartData = ref<ChartData<'line'> | null>(null);
  const loading = ref(false);
  const range = ref<TimeRange>(DEFAULT_TIME_RANGE);

  const fetchChart = async () => {
    if (!coinId) return;
    loading.value = true;

    try {
      const rawData = await chartStore.fetchCoinChart(coinId, range.value);
      
      const prices = rawData.prices.map((item: [number, number]): PricePoint => ({
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
      console.error('Chart error:', err);
    } finally {
      loading.value = false;
    }
  };

  watch(range, fetchChart, { immediate: true });

  return { chartData, loading, range };
}
