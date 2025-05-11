<template>
  <q-page class="q-pa-md">
    <h1 class="text-h4 q-mb-md">Top 10 Cryptocurrencies (by market cap)</h1>
    <SearchBar />
    <q-list bordered padding class="rounded-borders bg-grey-1">
      <q-item v-for="coin in coinListStore.coins" :key="coin.id" clickable @click="$router.push(`/coin/${coin.id}`)">
        <q-item-section avatar>
          <q-avatar>
            <img :src="coin.image" :alt="coin.name" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ coin.name }} ({{ coin.symbol.toUpperCase() }})
          </q-item-label>
          <q-btn
            flat
            :color="watchlistStore.watchlist.includes(coin.id) ? 'negative' : 'primary'"
            :label="watchlistStore.watchlist.includes(coin.id) ? 'Remove from Watchlist' : 'Add to Watchlist'"
            @click="watchlistStore.watchlist.includes(coin.id) ? watchlistStore.removeFromWatchlist(coin.id) : watchlistStore.addToWatchlist(coin.id)"
          />

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
      <span v-if="coinListStore.lastUpdated">Last updated: {{ coinListStore.lastUpdated }}</span>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useCoinListStore } from 'src/stores/coinListStore';
import { useWatchlistStore } from 'src/stores/watchlistStore';
import SearchBar from 'src/components/SearchBar.vue';

const watchlistStore = useWatchlistStore();
const coinListStore = useCoinListStore();

</script>
