import { useCoinDetailsStore } from 'src/stores/coinDetailsStore';
import { ref, onMounted } from 'vue';
import type { CoinDetails } from 'src/models/CoinDetails';

export function useCoinDetails(id: string) {
  const store = useCoinDetailsStore();
  const coin = ref<CoinDetails | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function loadCached() {
    const cached = store.getCachedCoin(id);
    if (cached) {
      coin.value = cached;
    }
  }

  async function refreshIfNeeded() {
    if (!store.shouldRefresh(id)) return;

    loading.value = true;
    error.value = null;
    try {
      const fresh = await store.refreshCoinDetails(id);
      coin.value = fresh;
    } catch {
      error.value = 'Failed to refresh coin details';
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    loadCached();
    void refreshIfNeeded();
  });

  return { coin, loading, error };
}
