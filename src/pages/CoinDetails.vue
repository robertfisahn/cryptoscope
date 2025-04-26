<template>
    <q-page class="q-pa-md">
      <div v-if="loading">
        <q-spinner color="primary" size="2em" class="q-mb-md" />
        Loading...
      </div>
  
      <div v-else-if="coin">
        <h2 class="text-h5">{{ coin.name }} ({{ coin.symbol.toUpperCase() }})</h2>
        <img :src="coin.image.large" :alt="coin.name" width="64" class="q-mb-md" />
        <p>Current price (USD): ${{ coin.market_data.current_price.usd.toLocaleString() }}</p>
        <p>Market cap: ${{ coin.market_data.market_cap.usd.toLocaleString() }}</p>
        <p>24h Change: 
          <span :class="coin.market_data.price_change_percentage_24h >= 0 ? 'text-positive' : 'text-negative'">
            {{ coin.market_data.price_change_percentage_24h.toFixed(2) }}%
          </span>
        </p>
      </div>
  
      <div v-else>
        <p class="text-negative">Failed to load coin data.</p>
      </div>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  import type { CoinDetails } from 'src/models/CoinDetails'
  
  const route = useRoute()
  const id = route.params.id as string
  
  const coin = ref<CoinDetails | null>(null)
  const loading = ref(true)
  
  const fetchCoinDetails = async () => {
    try {
      const res = await axios.get(`https://api.coingecko.com/api/v3/coins/${id}`)
      coin.value = res.data
    } catch (err) {
      console.error('Error fetching coin details:', err)
    } finally {
      loading.value = false
    }
  }
  
  onMounted(() => {
    void fetchCoinDetails()
  })
  </script>
  