import { json, newsData } from './_utils.js';
export default async function handler(){ return json(await newsData()); }
