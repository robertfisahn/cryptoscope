import { defineStore } from 'pinia';
import { api } from 'boot/axios';
import type { CoinListItem } from 'src/models/CoinListItem';

export const useHomeStore = defineStore('home', {
  state: () => ({
    coins: [] as CoinListItem[],
    lastUpdated: '' as string,
  }),
  actions: {
    async fetchTopCoins() {
      try {
        const res = await api.get<CoinListItem[]>('/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
          }
        });
        this.coins = res.data;
        this.lastUpdated = new Date().toLocaleTimeString();
      } catch (error) {
        console.error('Error fetching top coins:', error);
      }
    }
  }
});
