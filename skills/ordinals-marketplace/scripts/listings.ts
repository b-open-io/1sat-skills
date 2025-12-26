#!/usr/bin/env bun

async function getListings(limit: number = 20): Promise<void> {
  const apiUrl = `https://ordinals.gorillapool.io/api/market/listings?limit=${limit}`;

  console.log(`Fetching ${limit} active marketplace listings...\n`);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const listings = await response.json();

    console.log("🏪 Active Marketplace Listings\n");
    console.log(JSON.stringify(listings, null, 2));

  } catch (error: any) {
    throw new Error(`Failed to fetch listings: ${error.message}`);
  }
}

const args = process.argv.slice(2);
const limit = args[0] ? parseInt(args[0]) : 20;

getListings(limit).catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
