import { json, defiData } from './_utils.js';
export default async function handler(){ return json(await defiData()); }
