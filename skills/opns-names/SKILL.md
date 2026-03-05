---
name: opns-names
description: "This skill should be used when working with OpNS (Op = operation, NS = like DNS) names — registering identity keys on names, deregistering identity bindings, looking up OpNS names, or managing on-chain name resolution. Triggers on 'OpNS', 'register name', 'name service', 'on-chain DNS', 'identity binding', 'name resolution', 'deregister name', or 'opns.idKey'. Uses @1sat/actions opns module."
---

# OpNS Names

Register and manage identity key bindings on OpNS names using `@1sat/actions`.

## What is OpNS?

OpNS (Op = "operation", a key field in the original Ordinals protocol; NS = like DNS) is a decentralized name system on BSV where:
- Names are ordinal inscriptions (1-sat outputs)
- Names can bind to an identity public key via MAP metadata
- Binding is done on-chain via the `opns.idKey` MAP field
- The overlay indexes name-to-identity mappings

## Actions

| Action | Description |
|--------|-------------|
| `opnsRegister` | Bind wallet's identity key to an OpNS name |
| `opnsDeregister` | Remove identity binding from an OpNS name |

## Register Identity on a Name

```typescript
import { opnsRegister, createContext } from '@1sat/actions'

const ctx = createContext(wallet, { services })

// 1. List OpNS ordinals from the wallet (uses 'opns' basket, not 'ordinals')
const result = await ctx.wallet.listOutputs({
  basket: 'opns',
  includeTags: true,
  includeCustomInstructions: true,
  include: 'entire transactions',
})
const outputs = result.outputs
const BEEF = result.BEEF

// 2. Find the OpNS name to register
const opnsOrdinal = outputs.find(o =>
  o.tags?.some(t => t === 'type:application/op-ns')
)

if (!opnsOrdinal || !BEEF) {
  throw new Error('No OpNS name found in wallet')
}

// 3. Register identity key
const result = await opnsRegister.execute(ctx, {
  ordinal: opnsOrdinal,
  inputBEEF: Array.from(BEEF),
})

if (result.txid) {
  console.log('Registered! txid:', result.txid)
}
```

### What Registration Does

1. Gets the wallet's identity public key via `wallet.getPublicKey({ identityKey: true })`
2. Transfers the OpNS ordinal to self with MAP metadata: `{ 'opns.idKey': identityPubKey }`
3. Adds the `opns:published` tag to the output
4. Signs and broadcasts the transaction
5. Submits to the OpNS overlay (`tm_opns` topic) for indexing

## Deregister Identity from a Name

```typescript
import { opnsDeregister, createContext } from '@1sat/actions'

const ctx = createContext(wallet, { services })

const result = await ctx.wallet.listOutputs({
  basket: 'opns',
  includeTags: true,
  includeCustomInstructions: true,
  include: 'entire transactions',
})
const { outputs, BEEF } = result
const opnsOrdinal = outputs.find(o =>
  o.tags?.some(t => t === 'opns:published')
)

const result = await opnsDeregister.execute(ctx, {
  ordinal: opnsOrdinal,
  inputBEEF: Array.from(BEEF),
})
```

### What Deregistration Does

1. Transfers the OpNS ordinal to self with MAP metadata: `{ 'opns.idKey': '' }` (empty string)
2. Removes the `opns:published` tag
3. Submits to overlay to clear the identity binding

## Looking Up OpNS Names

Use the 1sat-stack API to resolve names:

```typescript
// Lookup by name
const res = await fetch('https://api.1sat.app/1sat/overlay/lookup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    service: 'ls_opns',
    query: { name: 'alice' },
  }),
})
const result = await res.json()
// Returns identity public key bound to the name
```

## OpNS Baskets and Tags

OpNS ordinals are stored in the `opns` basket (not `ordinals`):

```typescript
// List only OpNS names
const opnsOutputs = await wallet.listOutputs({
  basket: 'opns',
  includeTags: true,
  includeCustomInstructions: true,
  include: 'entire transactions',
})
```

### Tags on OpNS outputs

| Tag | Meaning |
|-----|---------|
| `type:application/op-ns` | This is an OpNS name |
| `opns:published` | Identity key is currently registered |
| `origin:{outpoint}` | Origin outpoint of the name |
| `name:{value}` | The name string |

## Requirements

```bash
bun add @1sat/actions @1sat/wallet @bsv/sdk
```

OpNS operations require `services` for overlay submission.
