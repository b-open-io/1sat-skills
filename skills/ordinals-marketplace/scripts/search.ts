#!/usr/bin/env bun

import { IndexerClient } from '@1sat/client'
import { ONESAT_MAINNET_URL } from '@1sat/types'

async function searchInscriptions(query: string): Promise<void> {
  console.log(`Searching 1Sat Ordinals for: "${query}"\n`);

  try {
    const indexer = new IndexerClient(ONESAT_MAINNET_URL)

    // Search using the indexer client
    const results = await indexer.inscriptions({
      search: query,
      limit: 20,
      orderBy: 'createdAt',
      orderDirection: 'desc'
    })

    console.log("🔍 Search Results\n");

    if (!results || results.length === 0) {
      console.log("No inscriptions found.");
      return;
    }

    // Display results
    results.forEach((inscription: any, index: number) => {
      console.log(`📄 ${index + 1}. Inscription ${inscription.id}`)
      console.log(`   Type: ${inscription.contentType}`)
      console.log(`   Size: ${inscription.contentLength} bytes`)
      console.log(`   Created: ${new Date(inscription.createdAt).toLocaleDateString()}`)
      if (inscription.collection) {
        console.log(`   Collection: ${inscription.collection}`)
      }
      console.log(`   View: https://ordinals.gorillapool.io/inscription/${inscription.id}`)
      console.log('')
    })

    console.log(`Total results: ${results.length}`)

  } catch (error: any) {
    // Fallback to direct API if client fails
    console.log("Falling back to direct API...")
    const apiUrl = `https://ordinals.gorillapool.io/api/inscriptions/search?q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const results = await response.json();

      if (Array.isArray(results) && results.length === 0) {
        console.log("No inscriptions found.");
        return;
      }

      console.log(JSON.stringify(results, null, 2));

    } catch (fallbackError: any) {
      throw new Error(`Search failed: ${fallbackError.message}`);
    }
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: bun run search.ts <query>");
  console.error("");
  console.error("Examples:");
  console.error("  bun run search.ts 'pixel art'");
  console.error("  bun run search.ts 'collection-name'");
  console.error("  bun run search.ts 'pepe'");
  process.exit(1);
}

searchInscriptions(args.join(" ")).catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});