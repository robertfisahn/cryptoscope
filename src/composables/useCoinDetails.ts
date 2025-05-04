import { useCoinDetailsStore } from 'src/stores/coinDetailsStore';
import { ref, onMounted } from 'vue';
import type { CoinDetails } from 'src/models/CoinDetails';

export function useCoinDetails(id: string) {
  const store = useCoinDetailsStore();
  const coin = ref<CoinDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchCoinDetails() {
    if (!id) return;
    loading.value = true;
    error.value = null;
    try {
      coin.value = await store.fetchCoinDetails(id);
    } catch {
      error.value = 'Failed to load coin details';
    } finally {
      loading.value = false;
    }    
  }

  onMounted(fetchCoinDetails);

  return { coin, loading, error, fetchCoinDetails };
}
