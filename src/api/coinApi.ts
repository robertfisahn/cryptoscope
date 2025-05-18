import { api } from 'boot/axios';
import { enqueueRequest } from 'src/utils/queue';

export const coinApi = {
  getCoinDetails: (id: string) =>
    enqueueRequest(() => api.get(`/coins/${id}`), 
      `CoinDetailsStore::${id}`, { 
        priority: 'high', 
        taskId: `CoinDetailsStore::${id}`, 
        cancelKey: `CoinDetailsStore::${id}`  
      }
    ),

  getCoinMarketChart: (id: string, days: string) =>
    enqueueRequest(() => api.get(`/coins/${id}/market_chart`, { 
        params: { 
          vs_currency: 'usd', 
          days 
        }
      }), 
      `CoinChartStore::${id}::${days}`, { 
        priority: 'high', 
        taskId: `CoinChartStore::${id}::${days}`, 
        cancelKey: `CoinChartStore::${id}`
      }
    ),

  getCoins: () =>
    enqueueRequest(() => api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 10,
        page: 1,
        sparkline: false
      }
    }), 'CoinListStore'),

  getSearchList: () =>
    enqueueRequest(() => api.get('/coins/list'), 'SearchStore')
};
