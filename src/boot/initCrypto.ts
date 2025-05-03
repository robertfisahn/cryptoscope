import { boot } from 'quasar/wrappers'
import { useCryptoStore } from 'stores/cryptoStore'

export default boot(async () => {
  const store = useCryptoStore()
  store.loadFromCache()
  await store.fetchCoins()
  store.startAutoRefresh(20000)
})
