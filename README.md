# Wave2 Web3 API Portal — SoSoValue + SoDEX Version

A Wave 2 Web3 builder dashboard inspired by LMS-style portal UI, upgraded with real API integrations.

## What it uses

- SoSoValue API for market/news intelligence when env keys are provided
- SoDEX route for account/trading readiness status
- CoinGecko public API fallback
- Binance public ticker fallback
- DefiLlama protocol TVL API
- GitHub REST API
- CryptoCompare news fallback

## Vercel settings

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install --registry=https://registry.npmjs.org/`

## Environment variables

Add these in Vercel > Settings > Environment Variables.

```env
SOSOVALUE_API_KEY=your_sosovalue_api_key
SOSOVALUE_BASE_URL=https://openapi.sosovalue.com/openapi/v1
SOSOVALUE_MARKET_PATH=/token/market/list
SOSOVALUE_NEWS_PATH=/news/list

SODEX_NETWORK=mainnet
SODEX_REST_BASE=https://mainnet-gw.sodex.dev/api/v1/perps
SODEX_SPOT_REST_BASE=https://mainnet-gw.sodex.dev/api/v1/spot
SODEX_USER_ADDRESS=0x_your_wallet_address
SODEX_API_KEY_NAME=your_sodex_api_key_name
SODEX_API_PRIVATE_KEY=your_sodex_api_private_key
SODEX_CHAIN_ID=286623
SODEX_ACCOUNT_ID=
```

`SODEX_ACCOUNT_ID` can be left empty if you do not have it yet.
