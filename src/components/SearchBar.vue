<template>
    <div>
      <q-input
        filled
        debounce="300"
        v-model="query"
        label="Search Cryptocurrency"
        placeholder="Enter coin name or symbol..."
        @update:model-value="onSearch"
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
  
      <q-list v-if="filteredCoins.length > 0">
        <q-item
          v-for="coin in filteredCoins"
          :key="coin.id"
          clickable
          @click="$router.push(`/coin/${coin.id}`)"
          class="q-my-xs"
        >
          <q-item-section>
            <q-item-label>{{ coin.name }} ({{ coin.symbol.toUpperCase() }})</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { useSearchStore } from 'src/stores/searchStore';
  
  const searchStore = useSearchStore();
  const query = ref('');
  
  const filteredCoins = computed(() => {
    if (!query.value) return [];
    const q = query.value.toLowerCase();
    return searchStore.coins.filter(
      coin =>
        coin.name.toLowerCase().includes(q) ||
        coin.symbol.toLowerCase().includes(q)
    ).slice(0, 10);
  });
  
  function onSearch() {
  }
  </script>
  