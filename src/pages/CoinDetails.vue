<template>
  <q-page class="q-pa-md">
    <div v-if="loadingCoin">
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

      <div class="q-mt-md">
        <q-btn-group push>
          <q-btn
            v-for="(label, value) in timeRanges"
            :key="value"
            :label="label"
            push
            :outline="range !== value"
            @click="range = value"
          />
        </q-btn-group>

        <div v-if="loadingChart" class="q-mt-md">
          <q-spinner size="2em" color="primary" />
        </div>
        <LineChart v-else-if="chartData" :chart-data="chartData" class="q-mt-md" />
      </div>
    </div>

    <div v-else>
      <p class="text-negative">Failed to load coin data.</p>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import LineChart from 'src/components/LineChart.vue';
import { useCoinChart } from 'src/composables/useCoinChart';
import { useCoinDetails } from 'src/composables/useCoinDetails';
import type { TimeRange } from 'src/composables/useCoinChart';

const route = useRoute();
const id = route.params.id as string;

const { coin, loading: loadingCoin } = useCoinDetails(id);
const { chartData, loading: loadingChart, range } = useCoinChart(id);

const timeRanges: Record<TimeRange, string> = {
  '1': '24h',
  '7': '7d',
  '30': '1m'
};
</script>

