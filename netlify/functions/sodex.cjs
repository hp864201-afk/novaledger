const { ok } = require('./_common.cjs');
exports.handler = async function(){return ok({source:'secure',data:{network:process.env.SODEX_NETWORK||'mainnet',status:process.env.SODEX_API_KEY_NAME?'Connected':'Ready',execution:'Protected',account:process.env.SODEX_USER_ADDRESS?`${process.env.SODEX_USER_ADDRESS.slice(0,6)}...${process.env.SODEX_USER_ADDRESS.slice(-4)}`:'Not connected'}})}
