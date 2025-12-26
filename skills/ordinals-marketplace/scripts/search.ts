#!/usr/bin/env bun

async function searchInscriptions(query: string): Promise<void> {
  const apiUrl = `https://ordinals.gorillapool.io/api/inscriptions/search?q=${encodeURIComponent(query)}`;

  console.log(`Searching 1Sat Ordinals for: "${query}"\n`);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const results = await response.json();

    console.log("🔍 Search Results\n");

    if (Array.isArray(results) && results.length === 0) {
      console.log("No inscriptions found.");
      return;
    }

    console.log(JSON.stringify(results, null, 2));

  } catch (error: any) {
    throw new Error(`Search failed: ${error.message}`);
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: bun run search.ts <query>");
  console.error("");
  console.error("Examples:");
  console.error("  bun run search.ts 'pixel art'");
  console.error("  bun run search.ts 'collection-name'");
  process.exit(1);
}

searchInscriptions(args.join(" ")).catch(e => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
