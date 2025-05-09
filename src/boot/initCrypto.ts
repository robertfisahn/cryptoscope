import { boot } from 'quasar/wrappers'
import { useCoinListStore } from 'src/stores/coinListStore'
import { useSearchStore } from 'src/stores/searchStore'

export default boot(async () => {
  const coinListStore = useCoinListStore()
  coinListStore.loadFromCache()
  await coinListStore.fetchCoins()
  coinListStore.startAutoRefresh(20000)

  const searchStore = useSearchStore()
  await searchStore.fetchCoinsList()
  searchStore.startAutoRefresh(1000 * 60 * 60 * 24)
})
