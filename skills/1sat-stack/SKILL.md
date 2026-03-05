---
name: 1sat-stack
description: "This skill should be used when working with the 1sat-stack unified BSV indexing API — whenever an agent needs to fetch UTXOs, look up inscriptions or ordinals, get BSV21 token balances, access ORDFS on-chain content, broadcast transactions, look up BAP identities, or stream real-time BSV events. Use this when replacing WhatsOnChain, GorillaPool ordinals API, or other separate BSV indexers. Also use when the user asks about 'api.1sat.app', 'unified BSV indexer', 'BSV21 token lookup', 'ORDFS content', 'overlay engine', or 'broadcasting BEEF transactions'."
version: 1.0.0
---

# 1sat-stack

Composable BSV indexing server consolidating overlay engine, TXO indexer, BSV21 tokens, ORDFS, and BAP identity into a single API.

**Production API base:** `https://api.1sat.app/1sat`

Source: https://github.com/b-open-io/1sat-stack

---

## Core API Endpoints

All endpoints are prefixed with `/1sat` on the hosted instance.

### Transaction Outputs (TXOs)

```
GET  /txo/{outpoint}              Get a specific output (e.g., txid.0)
GET  /txo/tx/{txid}               All outputs for a transaction
POST /txo/search                  Search outputs with filters (tags, owner, type)
POST /txo/outpoints               Bulk fetch multiple outpoints
POST /txo/spends                  Check spend status of outpoints
GET  /txo/{outpoint}/spend        Get spending txid for an output
```

### Owner (Address) Queries

```
GET  /owner/{address}/txos        All unspent outputs for an address
GET  /owner/{address}/balance     Satoshi balance for an address
```

Use `owner` endpoints as the primary way to fetch UTXOs before building transactions.

### BEEF Transactions

```
GET  /beef/{txid}                 Full BEEF (tx + merkle proof)
GET  /beef/{txid}/tx              Raw transaction bytes only
GET  /beef/{txid}/proof           Merkle proof bytes only
```

### Broadcasting (Arcade)

```
POST /arcade/tx                   Broadcast single BEEF transaction
POST /arcade/txs                  Broadcast multiple BEEF transactions
GET  /arcade/tx/{txid}            Check broadcast status
GET  /arcade/policy               Fee rates and transaction limits
GET  /arcade/events/{token}       SSE stream of broadcast status updates
```

### BSV21 Fungible Tokens

```
GET  /bsv21/{tokenId}                                        Token details
GET  /bsv21/{tokenId}/outputs                                All token outputs
GET  /bsv21/{tokenId}/{lockType}/{address}/balance           Token balance for address
GET  /bsv21/{tokenId}/{lockType}/{address}/unspent           Unspent token UTXOs
GET  /bsv21/{tokenId}/{lockType}/{address}/history           Token history for address
GET  /bsv21/lookup                                           Discover tokens by ticker
```

`lockType` is typically `p2pkh`.

### ORDFS (On-chain Content)

```
GET  /content/{path}              Serve ordinal content by path
GET  /ordfs/stream/{outpoint}     Stream ORDFS content by outpoint
GET  /ordfs/metadata/{path}       Get ORDFS file metadata
```

### BAP Identity

```
GET  /bap/profile/{bapId}         Profile for a BAP identity
POST /bap/identity/get            Resolve identity from address or idKey
GET  /bap/identity/search         Search identities by query
```

### Real-time Streaming

```
GET  /sse/{topics}                SSE stream for comma-separated topic events
GET  /chaintracks/tip/stream      SSE stream of new block tips
```

### Chain Info

```
GET  /chaintracks/height          Current chain height
GET  /chaintracks/tip             Latest block header
GET  /health                      Server health check
```

### Overlay Engine (Advanced)

```
POST /overlay/submit              Submit tagged BEEF to the overlay
POST /overlay/lookup              Query the overlay lookup services
GET  /overlay/listTopicManagers   List active topic managers
GET  /overlay/listLookupServiceProviders  List active lookup services
```

---

## Common Patterns

### Fetch UTXOs to Build a Transaction

```typescript
const res = await fetch('https://api.1sat.app/1sat/owner/1A1zP1.../txos');
const utxos = await res.json();
// utxos: array of {outpoint, satoshis, data, score, ...}
```

### Broadcast a Transaction

```typescript
const res = await fetch('https://api.1sat.app/1sat/arcade/tx', {
  method: 'POST',
  headers: { 'Content-Type': 'application/octet-stream' },
  body: beefHex  // BEEF format
});
const result = await res.json();
// result.txid on success
```

### Get BSV21 Token Balance

```typescript
const tokenId = 'abc123...'; // BSV21 token ID (txid of deploy)
const address = '1A1zP1...';
const res = await fetch(
  `https://api.1sat.app/1sat/bsv21/${tokenId}/p2pkh/${address}/balance`
);
const { balance } = await res.json();
```

### Search for Inscriptions by Owner

```typescript
const res = await fetch('https://api.1sat.app/1sat/txo/search', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    owner: '1A1zP1...',
    tag: 'inscription',
    limit: 100
  })
});
const inscriptions = await res.json();
```

---

## Authentication

Most endpoints are public. For higher rate limits, add an API key:

```typescript
headers: { 'Authorization': 'Bearer YOUR_API_KEY' }
```

Rate limits:
- Public: 100 req/min
- Authenticated: 1000 req/min

---

## Self-Hosting

1sat-stack is open source and deployable on Railway. Each service module is configured via `config.yaml` with `mode: embedded | remote | disabled`. See `config.example.yaml` in the repo for full options.

---

## Reference Files

For detailed endpoint parameters and response schemas, see:
- **`references/api-reference.md`** — Full endpoint reference with request/response details
- **`examples/migration-guide.md`** — Before/after patterns migrating from WOC + GorillaPool + others
- **`scripts/query-unified.ts`** — Working TypeScript examples for all major operations
