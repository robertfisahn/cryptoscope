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
    })
};
