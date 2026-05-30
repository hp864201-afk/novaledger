import { ok, safeJson } from './_lib.js';

function baseUrl(market = 'perps') {
  const network = process.env.SODEX_NETWORK || 'mainnet';
  if (market === 'spot') return process.env.SODEX_SPOT_REST_BASE || (network === 'testnet' ? 'https://testnet-gw.sodex.dev/api/v1/spot' : 'https://mainnet-gw.sodex.dev/api/v1/spot');
  return process.env.SODEX_REST_BASE || (network === 'testnet' ? 'https://testnet-gw.sodex.dev/api/v1/perps' : 'https://mainnet-gw.sodex.dev/api/v1/perps');
}

export default async function handler(req, res) {
  const market = req.query?.market === 'spot' ? 'spot' : 'perps';
  const userAddress = process.env.SODEX_USER_ADDRESS || process.env.SODEX_WALLET_ADDRESS || '';
  const accountID = process.env.SODEX_ACCOUNT_ID || '';
  const apiKeyName = process.env.SODEX_API_KEY_NAME || '';

  const status = {
    ok: true,
    source: 'SoDEX',
    configured: Boolean(userAddress),
    tradingKeyReady: Boolean(apiKeyName && process.env.SODEX_API_PRIVATE_KEY),
    market,
    network: process.env.SODEX_NETWORK || 'mainnet',
    accountID: accountID ? 'configured' : 'optional',
    account: null,
    message: userAddress ? 'SoDEX account route configured.' : 'Set SODEX_USER_ADDRESS to load account state.'
  };

  if (!userAddress) return ok(res, status);

  try {
    const target = new URL(`${baseUrl(market)}/accounts/${userAddress}/state`);
    if (accountID) target.searchParams.set('accountID', accountID);
    const data = await safeJson(target, { timeout: 8500 });
    return ok(res, { ...status, account: data, accountLoaded: true, message: 'SoDEX account state loaded.' });
  } catch {
    return ok(res, { ...status, accountLoaded: false, message: 'SoDEX account route is configured, but the upstream request is temporarily unavailable.' });
  }
}
