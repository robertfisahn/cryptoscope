import { defineStore } from 'pinia'
import axios from 'axios'
import type { CoinListItem } from 'src/models/CoinListItem'

const CACHE_KEY = 'crypto_cache'

export const useCryptoStore = defineStore('crypto', {
  state: () => ({
    coins: [] as CoinListItem[],
    lastUpdated: null as string | null,
    loading: false,
    error: null as string | null,
    refreshInterval: null as number | null
  }),

  actions: {
    async fetchCoins(force = false) {
      if (this.coins.length > 0 && !force) return

      this.loading = true
      this.error = null

      try {
        const res = await axios.get<CoinListItem[]>('https://api.coingecko.com/api/v3/coins/markets', {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false
          }
        })

        this.coins = res.data
        this.lastUpdated = new Date().toLocaleTimeString();
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          coins: this.coins,
          lastUpdated: this.lastUpdated
        }))

      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err)
        console.error('API error:', errorMessage)
        this.error = 'No internet connection. Loaded cached data.'
        this.loadFromCache()
      } finally {
        this.loading = false
      }
    },

    loadFromCache() {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { coins, lastUpdated } = JSON.parse(cached)
        this.coins = coins
        this.lastUpdated = lastUpdated
      }
    },

    startAutoRefresh(intervalMs = 20000) {
      if (this.refreshInterval) return
      this.refreshInterval = window.setInterval(() => {
        void this.fetchCoins(true)
      }, intervalMs)
    },

    stopAutoRefresh() {
      if (this.refreshInterval) {
        clearInterval(this.refreshInterval)
        this.refreshInterval = null
      }
    }
  }
})
