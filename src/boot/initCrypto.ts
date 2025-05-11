import { boot } from 'quasar/wrappers'
import { useCoinListStore } from 'src/stores/coinListStore'
import { useSearchStore } from 'src/stores/searchStore'

export default boot(async () => {
  const coinListStore = useCoinListStore()
  await coinListStore.fetchCoins()
  coinListStore.startAutoRefresh(20000)

  const searchStore = useSearchStore()
  await searchStore.fetchSearchCoins()
  searchStore.startAutoRefresh(1000 * 60 * 60 * 24)
})
