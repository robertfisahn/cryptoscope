<template>
    <q-page class="q-pa-md">
      <h1 class="text-h4 q-mb-md">My Watchlist</h1>
  
      <div v-if="filteredCoins.length === 0" class="text-grey">
        Your watchlist is empty. Add some coins from Home page!
      </div>
  
      <q-list bordered padding v-else class="rounded-borders bg-grey-1">
        <q-item
          v-for="coin in filteredCoins"
          :key="coin.id"
          clickable
          v-ripple
          @click="$router.push(`/coin/${coin.id}`)"
          class="q-my-xs"
        >
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
              Price: ${{ coin.current_price.toLocaleString() }}
            </q-item-label>
          </q-item-section>
  
          <q-item-section side>
            <q-btn
              dense
              flat
              icon="delete"
              color="negative"
              @click.stop="watchlistStore.removeFromWatchlist(coin.id)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-page>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useCoinListStore } from 'src/stores/coinListStore';
  import { useWatchlistStore } from 'src/stores/watchlistStore';
  
  const cryptoStore = useCoinListStore();
  const watchlistStore = useWatchlistStore();
  
  const filteredCoins = computed(() =>
    cryptoStore.coins.filter(coin => watchlistStore.watchlist.includes(coin.id))
  );
  </script>
  