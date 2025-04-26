export type CoinDetails = {
    id: string
    name: string
    symbol: string
    image: {
      thumb: string
      small: string
      large: string
    }
    market_data: {
      current_price: {
        usd: number
      }
      market_cap: {
        usd: number
      }
      price_change_percentage_24h: number
    }
  }
  