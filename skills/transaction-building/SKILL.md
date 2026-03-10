---
name: transaction-building
description: "This skill should be used when building BSV transactions with the 1sat-sdk — sending BSV payments, batch payments, OP_RETURN data, custom scripts, signing workflows (createAction/signAction), or understanding the BRC-100 action system. Triggers on 'send BSV', 'build transaction', 'batch payment', 'OP_RETURN', 'createAction', 'signAction', 'sign transaction', 'payment requests', 'locking script', 'action registry', or 'BRC-100'. Uses @1sat/actions and @1sat/core packages."
---

# Transaction Building

Build and sign BSV transactions using the `@1sat/actions` system and `@1sat/core` utilities.

## The Action System

All 1sat-sdk operations use the BRC-100 action pattern:

```
createContext() → action.execute(ctx, input) → { txid, rawtx, error }
```

Actions work with any BRC-100 compatible wallet (OneSatWallet, browser extension, etc).

### Context Setup

```typescript
import { createContext } from '@1sat/actions'

// Basic context (wallet only)
const ctx = createContext(wallet)

// Full context (wallet + services for network operations)
const ctx = createContext(wallet, { services })
```

## Send BSV

```typescript
import { sendBsv, createContext } from '@1sat/actions'

const ctx = createContext(wallet)

// Simple payment
const result = await sendBsv.execute(ctx, {
  requests: [
    { address: '1Recipient...', satoshis: 50000 },
  ],
})

// Multiple recipients (batch payment)
const result = await sendBsv.execute(ctx, {
  requests: [
    { address: '1Alice...', satoshis: 10000 },
    { address: '1Bob...', satoshis: 20000 },
    { address: '1Charlie...', satoshis: 30000 },
  ],
})

// Custom locking script
const result = await sendBsv.execute(ctx, {
  requests: [
    { script: '76a914...88ac', satoshis: 5000 }, // hex locking script
  ],
})

// OP_RETURN data
const result = await sendBsv.execute(ctx, {
  requests: [
    { data: ['hello', 'world'], satoshis: 0 },
  ],
})

// Payment with inscription
const result = await sendBsv.execute(ctx, {
  requests: [
    {
      address: '1Recipient...',
      satoshis: 1,
      inscription: {
        base64Data: btoa('Hello on-chain'),
        mimeType: 'text/plain',
      },
    },
  ],
})
```

## Send All BSV

```typescript
import { sendAllBsv, createContext } from '@1sat/actions'

const ctx = createContext(wallet)

// Send entire wallet balance to one address
const result = await sendAllBsv.execute(ctx, {
  destination: '1Recipient...',
})
```

## Sign Messages (BSM)

```typescript
import { signBsm, createContext } from '@1sat/actions'

const ctx = createContext(wallet)

const result = await signBsm.execute(ctx, {
  message: 'Hello, I own this wallet',
  encoding: 'utf8',  // 'utf8' | 'hex' | 'base64'
})

// result: { address, pubKey, message, sig }
// sig is base64-encoded compact signature (BSM format)

// With derivation tag for domain-specific keys
const result = await signBsm.execute(ctx, {
  message: 'Login to example.com',
  tag: {
    label: 'auth',
    id: 'session123',
    domain: 'example.com',
    meta: {},
  },
})
```

## The Two-Phase Signing Pattern

For operations involving custom scripts (ordinals, locks, tokens), the SDK uses a two-phase approach:

### Phase 1: createAction (build the transaction)

```typescript
const createResult = await wallet.createAction({
  description: 'Transfer ordinal',
  inputBEEF: beefData,          // BEEF containing source transactions
  inputs: [{
    outpoint: 'txid.vout',
    inputDescription: 'Ordinal to transfer',
    unlockingScriptLength: 108,  // Expected script size
  }],
  outputs: [{
    lockingScript: '76a914...88ac',
    satoshis: 1,
    outputDescription: 'Transferred ordinal',
    basket: 'ordinals',
    tags: ['type:image/png', 'origin:abc...'],
    customInstructions: JSON.stringify({ protocolID, keyID }),
  }],
  options: {
    signAndProcess: false,       // Don't auto-sign yet
    randomizeOutputs: false,     // Preserve output order
  },
})
```

### Phase 2: signAction (provide unlocking scripts)

```typescript
// Get the signable transaction
const tx = Transaction.fromBEEF(createResult.signableTransaction.tx)

// Build custom unlocking scripts per input
const spends = {
  0: { unlockingScript: myUnlockingScript.toHex() },
}

// Complete the transaction
const signResult = await wallet.signAction({
  reference: createResult.signableTransaction.reference,
  spends,
  options: { acceptDelayedBroadcast: false },
})

// signResult.txid is the broadcast transaction ID
```

## Action Registry

All actions are registered in a global registry:

```typescript
import { actionRegistry } from '@1sat/actions'

// List all registered actions
for (const action of actionRegistry.list()) {
  console.log(`${action.meta.name} (${action.meta.category})`)
}

// Get a specific action
const send = actionRegistry.get('sendBsv')

// Convert to MCP tool definitions
const tools = actionRegistry.toMcpTools()
```

### All Registered Actions

| Category | Actions |
|----------|---------|
| `payments` | `sendBsv`, `sendAllBsv` |
| `ordinals` | `getOrdinals`, `transferOrdinals`, `listOrdinal`, `cancelListing`, `purchaseOrdinal`, `deriveCancelAddress` |
| `tokens` | `listTokens`, `getBsv21Balances`, `sendBsv21`, `purchaseBsv21` |
| `inscriptions` | `inscribe` |
| `locks` | `getLockData`, `lockBsv`, `unlockBsv` |
| `signing` | `signBsm` |
| `sweep` | `sweepBsv`, `sweepOrdinals`, `sweepBsv21` |
| `opns` | `opnsRegister`, `opnsDeregister` |

## Using @1sat/core for Low-Level Tx Building

For operations outside the action system, use `@1sat/core` directly:

```typescript
import {
  createOrdinals, sendOrdinals, transferOrdTokens,
  createOrdListings, purchaseOrdListing,
  sendUtxos, deployBsv21Token, burnOrdinals,
  TxBuilder, createTxBuilder,
} from '@1sat/core'

// TxBuilder for custom transaction construction
const builder = createTxBuilder({
  utxos: paymentUtxos,
  paymentPk: privateKey,
  changeAddress: myAddress,
  satsPerKb: 50,
})
```

## Protocol Helpers

```typescript
import {
  // Sigma protocol (on-chain signatures)
  createSigma, signData,
  // MAP protocol (metadata)
  buildMapScript, createMap, isValidMap,
  // Inscription envelope
  buildInscriptionEnvelope, createInscription,
  // OrdP2PKH template
  createOrdP2PKHScript, OrdP2PKH,
  // OrdLock template (marketplace listings)
  createOrdLockScript, OrdLock,
} from '@1sat/core'
```

## Baskets and Tags

The wallet organizes outputs into baskets:

| Basket | Contents |
|--------|----------|
| `ordinals` | Ordinal inscriptions (NFTs) |
| `bsv21` | BSV-21 fungible tokens |
| `locks` | Time-locked BSV |
| `opns` | OpNS name ordinals |

Tags on outputs provide metadata for filtering:

```typescript
const result = await wallet.listOutputs({
  basket: 'ordinals',
  includeTags: true,
  includeCustomInstructions: true,
  include: 'entire transactions',  // include BEEF for spending
  limit: 100,
})
```

## Requirements

```bash
bun add @1sat/actions @1sat/core @bsv/sdk
```
