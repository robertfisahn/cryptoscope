import { defineStore } from 'pinia';
import { ref } from 'vue';
import { api } from 'boot/axios';

interface SearchCoin {
  id: string;
  symbol: string;
  name: string;
}

export const useSearchStore = defineStore('search', () => {
  const coins = ref<SearchCoin[]>([]);
  const loading = ref(false);

  async function fetchCoinsList() {
    loading.value = true;
    try {
      const res = await api.get<SearchCoin[]>('/coins/list');
      coins.value = res.data;
    } catch (err) {
      console.error('Error fetching coins list:', err);
    } finally {
      loading.value = false;
    }
  }

  return {
    coins,
    loading,
    fetchCoinsList,
  };
});
