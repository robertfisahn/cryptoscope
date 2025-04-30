import { ref, watch } from 'vue';
import axios from 'axios';
import type { ChartData } from 'chart.js';

export type TimeRange = '1' | '7' | '30'; // days

interface PricePoint {
  x: Date;
  y: number;
}

export function useCoinChart(coinId: string) {
  const chartData = ref<ChartData<'line'> | null>(null);
  const loading = ref(false);
  const range = ref<TimeRange>('7');

  const fetchChart = async () => {
    if (!coinId) return;
    loading.value = true;
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart`, {
        params: { vs_currency: 'usd', days: range.value }
      });

      const prices = res.data.prices.map((item: [number, number]): PricePoint => ({
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
