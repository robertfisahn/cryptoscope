<template>
  <q-page class="q-pa-md">
    <h1 class="text-h4 q-mb-md">Top 10 Cryptocurrencies (by market cap)</h1>

    <q-list bordered padding class="rounded-borders bg-grey-1">
      <q-item v-for="coin in coins" :key="coin.id" clickable @click="$router.push(`/coin/${coin.id}`)" class="q-my-xs">
        <q-item-section avatar>
          <q-avatar>
            <img :src="coin.image" :alt="coin.name" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
          </q-item-label>
          <q-item-label caption>
            Price: ${{ coin.current_price.toLocaleString() }} | 24h Change:
            <span :class="coin.price_change_percentage_24h >= 0 ? 'text-positive' : 'text-negative'">
              {{ coin.price_change_percentage_24h.toFixed(2) }}%
            </span>
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <div class="q-mt-md text-caption text-grey">
      <span v-if="lastUpdated">Last updated: {{ lastUpdated }}</span>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import type { CoinListItem } from 'src/models/CoinListItem'

const lastUpdated = ref<string | null>(null)
const coins = ref<CoinListItem[]>([])

const fetchCoins = async () => {
  try {
    const res = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: 10,
          page: 1,
        }
      }
    )
    coins.value = res.data
    lastUpdated.value = new Date().toLocaleTimeString()
  } catch (err) {
    console.error('Error loading data:', err)
  }
}

onMounted(() => {
  void fetchCoins()
  setInterval(() => void fetchCoins(), 10000)
})
</script>
