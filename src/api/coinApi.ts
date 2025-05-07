import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3'
});

export const coinApi = {
  getCoinDetails: (id: string) =>
    api.get(`/coins/${id}`),
  
  getCoinMarketChart: (id: string, days: string) =>
    api.get(`/coins/${id}/market_chart`, {
      params: { vs_currency: 'usd', days }
    }),

  getCoins: () =>
    api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false
      }
    })
};
