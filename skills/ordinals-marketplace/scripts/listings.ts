#!/usr/bin/env bun

import { IndexerClient } from '@1sat/client'
import { ONESAT_MAINNET_URL } from '@1sat/types'

async function getListings(limit: number = 20): Promise<void> {
  console.log(`Fetching ${limit} active marketplace listings...\n`);

  try {
    const indexer = new IndexerClient(ONESAT_MAINNET_URL)

    // Fetch active marketplace listings
    const listings = await indexer.marketListings({
      status: 'active',
      limit,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })

    console.log("🏪 Active Marketplace Listings\n");

    if (!listings || listings.length === 0) {
      console.log("No active listings found.");
      return;
    }

    // Display listings with formatted output
    listings.forEach((listing: any, index: number) => {
      const priceInBSV = (listing.price / 100_000_000).toFixed(8)
      console.log(`${index + 1}. Inscription: ${listing.inscriptionId}`)
      console.log(`   Price: ${listing.price} sats (${priceInBSV} BSV)`)
      console.log(`   Listed: ${new Date(listing.createdAt).toLocaleDateString()}`)
      if (listing.contentType) {
        console.log(`   Type: ${listing.contentType}`)
      }
      console.log(`   View: https://ordinals.gorillapool.io/inscription/${listing.inscriptionId}`)
      console.log('')
    })

  } catch (error: any) {
    // Fallback to direct API
    console.log("Using direct API...")
    const apiUrl = `https://ordinals.gorillapool.io/api/market/listings?limit=${limit}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const listings = await response.json();
      console.log(JSON.stringify(listings, null, 2));

    } catch (fallbackError: any) {
      throw new Error(`Failed to fetch listings: ${fallbackError.message}`);
    }
  }
}

const args = process.argv.slice(2);
const limit = args[0] ? parseInt(args[0]) : 20;

if (isNaN(limit) || limit < 1 || limit > 100) {
  console.error("Usage: bun run listings.ts [limit]");
  console.error("");
  console.error("Examples:");
  console.error("  bun run listings.ts      # Default 20 listings");
  console.error("  bun run listings.ts 50   # Show 50 listings");
  process.exit(1);
}

getListings(limit).catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});