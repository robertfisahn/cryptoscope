import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useWatchlistStore = defineStore('watchlist', () => {
  const watchlist = ref<string[]>(loadFromLocalStorage());

  function loadFromLocalStorage(): string[] {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  }

  function saveToLocalStorage() {
    localStorage.setItem('watchlist', JSON.stringify(watchlist.value));
  }

  function addToWatchlist(coinId: string) {
    if (!watchlist.value.includes(coinId)) {
      watchlist.value.push(coinId);
    }
  }

  function removeFromWatchlist(coinId: string) {
    watchlist.value = watchlist.value.filter(id => id !== coinId);
  }

  watch(watchlist, saveToLocalStorage, { deep: true });

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist
  };
});
