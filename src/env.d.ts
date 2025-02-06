/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENVIRONMENT: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_CASINO_WALLET_ADDRESS: string
  readonly VITE_SUPPORTED_CHAINS: string
  readonly VITE_ETHEREUM_RPC_URL: string
  readonly VITE_POLYGON_RPC_URL: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_BTCPAY_SERVER_URL: string
  readonly VITE_BTCPAY_STORE_ID: string
  readonly VITE_BTCPAY_API_KEY: string
  readonly VITE_WEB3_NETWORK: string
  readonly VITE_CONTRACT_ADDRESS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 