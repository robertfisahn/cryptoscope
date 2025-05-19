import { boot } from 'quasar/wrappers'
import { setupNetworkListener } from 'src/utils/network'

export default boot(() => {
  setupNetworkListener()
})
