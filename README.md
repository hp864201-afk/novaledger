# NovaLedger

NovaLedger is a Wave 2 Web3 analytics and finance dashboard with English default UI and a Chinese language dropdown.

## Features

- Live market cards and charts
- DeFi TVL panels
- Crypto news signals
- Repository health panel
- Build tasks and timeline
- SoDEX readiness panel
- Interactive sidebar pages
- Language switcher: English / Chinese
- Netlify and Vercel compatible

## Netlify deploy

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Recommended env:

```env
SOSOVALUE_API_KEY=your_sosovalue_key
SOSOVALUE_BASE_URL=https://openapi.sosovalue.com/openapi/v1
SOSOVALUE_MARKET_PATH=/token/market/list
SOSOVALUE_NEWS_PATH=/news/list
SODEX_NETWORK=mainnet
SODEX_REST_BASE=https://mainnet-gw.sodex.dev/api/v1/perps
SODEX_SPOT_REST_BASE=https://mainnet-gw.sodex.dev/api/v1/spot
SODEX_USER_ADDRESS=0x_your_wallet
SODEX_API_KEY_NAME=your_sodex_key_name
SODEX_API_PRIVATE_KEY=your_sodex_private_key
SODEX_CHAIN_ID=286623
SODEX_ACCOUNT_ID=
SECRETS_SCAN_ENABLED=false
```
