import { json } from './_utils.js';
export default async function handler(){ return json({source:'secure',data:{network:process.env.SODEX_NETWORK||'mainnet',status:process.env.SODEX_API_KEY_NAME?'Connected':'Ready',execution:'Protected',account:process.env.SODEX_USER_ADDRESS?`${process.env.SODEX_USER_ADDRESS.slice(0,6)}...${process.env.SODEX_USER_ADDRESS.slice(-4)}`:'Not connected'}}); }
