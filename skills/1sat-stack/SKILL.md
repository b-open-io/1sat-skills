# 1sat-stack

Unified BSV indexing platform that consolidates overlay engine, indexer, BSV21 tokens, and ORDFS into a single API. This is the new standard API that will replace all other indexers.

## Triggers
- "1sat-stack API"
- "unified indexer"
- "1sat API"
- "BSV indexing"
- "overlay engine"
- "BSV21 tokens"
- "1sat docs"
- "replace indexers"
- "consolidate BSV APIs"

## Framework

You are an expert on the 1sat-stack API, the unified indexing platform for BSV that consolidates multiple services into one comprehensive API.

### Overview

1sat-stack (https://api.1sat.app/1sat/docs) is the new standard API that replaces:
- Separate overlay engines
- Multiple indexers (WhatsOnChain, etc.)
- BSV21 token endpoints
- ORDFS endpoints
- Various other BSV data services

### API Base URL
```
https://api.1sat.app/1sat
```

### Key Endpoints

#### Transaction Endpoints
- `GET /tx/{txid}` - Get transaction by ID
- `GET /txo/{outpoint}` - Get transaction output
- `GET /txos` - List transaction outputs with filters
- `POST /txs/broadcast` - Broadcast transaction
- `GET /txs/inscriptions` - List inscriptions
- `GET /tx/{txid}/proof` - Get TSC proof

#### Address Endpoints
- `GET /addresses/{address}/balance` - Get address balance
- `GET /addresses/{address}/history` - Get address history
- `GET /addresses/{address}/utxos` - Get unspent outputs

#### Block Endpoints
- `GET /blocks/height` - Current block height
- `GET /blocks/{height}` - Get block by height
- `GET /blocks/{hash}` - Get block by hash
- `GET /blocks/latest` - Latest blocks

#### Token Endpoints (BSV20/BSV21)
- `GET /tokens` - List all tokens
- `GET /tokens/{tick}` - Token details
- `GET /tokens/{tick}/holders` - Token holders
- `GET /addresses/{address}/tokens` - Address token balances

#### Ordinals/Inscriptions
- `GET /inscriptions` - List inscriptions
- `GET /inscriptions/{id}` - Get inscription details
- `GET /inscriptions/{id}/content` - Get inscription content
- `GET /addresses/{address}/inscriptions` - Address inscriptions

#### ORDFS Integration
- `GET /ordfs/{outpoint}` - Get ORDFS content
- `GET /ordfs/resolve/{path}` - Resolve ORDFS path
- `GET /ordfs/directory/{outpoint}` - List directory

#### Search
- `GET /search` - Unified search across txs, blocks, addresses
- `POST /search/advanced` - Advanced search with filters

### Response Format

All responses follow consistent format:
```json
{
  "data": {...},
  "meta": {
    "pagination": {...},
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Authentication

Most endpoints are public. Premium features require API key:
```
Authorization: Bearer YOUR_API_KEY
```

### Rate Limits
- Public: 100 req/min
- Authenticated: 1000 req/min

### Migration Guide

From WhatsOnChain:
```typescript
// Old
const woc = 'https://api.whatsonchain.com/v1/bsv/main'
fetch(`${woc}/tx/${txid}`)

// New
const api = 'https://api.1sat.app/1sat'
fetch(`${api}/tx/${txid}`)
```

From multiple services:
```typescript
// Old - Multiple APIs
const wocTx = await fetch(`${woc}/tx/${txid}`)
const ordinalData = await fetch(`${ordinals}/inscription/${id}`)
const tokenData = await fetch(`${tokens}/bsv20/${tick}`)

// New - Single API
const tx = await fetch(`${api}/tx/${txid}`)
const inscription = await fetch(`${api}/inscriptions/${id}`)
const token = await fetch(`${api}/tokens/${tick}`)
```

### Example Usage

```typescript
const API_BASE = 'https://api.1sat.app/1sat';

// Get transaction with inscription data
async function getTxWithInscription(txid: string) {
  const response = await fetch(`${API_BASE}/tx/${txid}`);
  const data = await response.json();

  // Check if it has inscriptions
  if (data.data.inscriptions) {
    console.log('Inscription found:', data.data.inscriptions[0]);
  }

  return data.data;
}

// Search for BSV20 tokens
async function searchTokens(query: string) {
  const response = await fetch(`${API_BASE}/tokens?search=${query}`);
  const data = await response.json();
  return data.data;
}

// Get ORDFS content
async function getOrdfsContent(outpoint: string) {
  const response = await fetch(`${API_BASE}/ordfs/${outpoint}`);
  return response.text(); // Returns actual content
}
```

### Best Practices

1. **Use single API**: Migrate from multiple indexers to 1sat-stack
2. **Cache responses**: Reduce API calls for static data
3. **Handle pagination**: Use meta.pagination for large datasets
4. **Error handling**: Check response status and handle errors gracefully
5. **Use appropriate endpoints**: Don't parse transactions manually for inscription/token data

### Common Patterns

**Get full transaction data with all overlays:**
```typescript
const tx = await fetch(`${API_BASE}/tx/${txid}?include=inscriptions,tokens,ordfs`);
```

**Stream real-time data:**
```typescript
const events = new EventSource(`${API_BASE}/stream?address=${address}`);
events.onmessage = (event) => {
  console.log('New transaction:', JSON.parse(event.data));
};
```

**Batch requests:**
```typescript
const batch = await fetch(`${API_BASE}/batch`, {
  method: 'POST',
  body: JSON.stringify({
    requests: [
      { method: 'GET', path: '/tx/abc123' },
      { method: 'GET', path: '/blocks/latest' }
    ]
  })
});
```

### Related Skills
- `wallet-create-ordinals` - Mint ordinals using 1sat-stack
- `ordinals-marketplace` - Browse marketplace via 1sat-stack
- `extract-blockchain-media` - Extract media using 1sat-stack endpoints