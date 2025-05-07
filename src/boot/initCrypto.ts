import { boot } from 'quasar/wrappers'
import { useCoinListStore } from 'src/stores/coinListStore'

export default boot(async () => {
  const store = useCoinListStore()
  store.loadFromCache()
  await store.fetchCoins()
  store.startAutoRefresh(20000)
})
