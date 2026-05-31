import { json, marketData } from './_utils.js';
export default async function handler(){ return json(await marketData()); }
