<template>
  <q-page class="q-pa-md">
    <h1 class="text-h4 q-mb-md">Top 10 Cryptocurrencies (by market cap)</h1>
    <SearchBar />
    <q-list bordered padding class="rounded-borders bg-grey-1">
      <q-item v-for="coin in homeStore.coins" :key="coin.id" clickable @click="$router.push(`/coin/${coin.id}`)" class="q-my-xs">
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
      <span v-if="homeStore.lastUpdated">Last updated: {{ homeStore.lastUpdated }}</span>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useHomeStore } from 'src/stores/homeStore';
import { useWatchlistStore } from 'src/stores/watchlistStore';
import { useSearchStore } from 'src/stores/searchStore';
import SearchBar from 'src/components/SearchBar.vue';


const watchlistStore = useWatchlistStore();
const searchStore = useSearchStore();
const homeStore = useHomeStore();

let intervalId: number | undefined;

onMounted(() => {
  console.log(`[HomePage] Fetching top coins at ${new Date().toLocaleTimeString()}`);
  void homeStore.fetchTopCoins();
  void searchStore.fetchCoinsList();
  intervalId = window.setInterval(() => {
    console.log(`[HomePage] Interval fetch at ${new Date().toLocaleTimeString()}`);
    void homeStore.fetchTopCoins();
  }, 15000);
});

onUnmounted(() => {
  console.log('[HomePage] Clearing interval for fetching top coins');
  if (intervalId) {
    clearInterval(intervalId);
  }
});

</script>
