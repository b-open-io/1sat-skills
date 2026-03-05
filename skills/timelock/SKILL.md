---
name: timelock
description: "This skill should be used when working with time-locked BSV — locking satoshis until a specific block height, checking lock status, unlocking matured locks, or understanding the lock script. Triggers on 'lock BSV', 'time lock', 'timelock', 'block height lock', 'unlock BSV', 'matured locks', 'lock data', or 'CLTV lock'. Uses @1sat/actions locks module."
---

# Timelock

Lock and unlock BSV until specific block heights using `@1sat/actions`.

## Actions

| Action | Description |
|--------|-------------|
| `getLockData` | Get summary of all locks (total, unlockable, next unlock) |
| `lockBsv` | Lock BSV until a specific block height |
| `unlockBsv` | Unlock all matured (expired) locks |

## Check Lock Status

```typescript
import { getLockData, createContext } from '@1sat/actions'

const ctx = createContext(wallet, { services })

const data = await getLockData.execute(ctx, {})

console.log(`Total locked: ${data.totalLocked} sats`)
console.log(`Unlockable now: ${data.unlockable} sats`)
console.log(`Next unlock at block: ${data.nextUnlock}`)
```

### LockData Response

```typescript
interface LockData {
  totalLocked: number   // Total satoshis in all locks
  unlockable: number    // Satoshis that can be unlocked now
  nextUnlock: number    // Block height of next maturing lock
}
```

## Lock BSV

```typescript
import { lockBsv, createContext } from '@1sat/actions'

const ctx = createContext(wallet, { services })

// Lock 10,000 sats until block 900000
const result = await lockBsv.execute(ctx, {
  requests: [
    { satoshis: 10000, until: 900000 },
  ],
})

// Multiple locks in one transaction
const result = await lockBsv.execute(ctx, {
  requests: [
    { satoshis: 5000, until: 880000 },
    { satoshis: 10000, until: 900000 },
    { satoshis: 50000, until: 950000 },
  ],
})

if (result.txid) {
  console.log('Locked! txid:', result.txid)
}
```

## Unlock Matured Locks

```typescript
import { unlockBsv, createContext } from '@1sat/actions'

const ctx = createContext(wallet, { services })

const result = await unlockBsv.execute(ctx, {})

if (result.txid) {
  console.log('Unlocked! txid:', result.txid)
} else if (result.error === 'no-matured-locks') {
  console.log('No locks ready to unlock yet')
}
```

### How Unlocking Works

1. Lists all outputs in the `locks` basket
2. Checks each lock's `until:` tag against current block height
3. Filters to only matured locks (until <= currentHeight)
4. Builds a transaction with `lockTime` set to the max `until` value
5. Sets input sequence numbers to 0 (required for nLockTime)
6. Signs each input with the lock key using SIGHASH_ALL|ANYONECANPAY
7. Includes the sighash preimage in the unlocking script

## How the Lock Script Works

The lock script combines a CLTV (CheckLockTimeVerify) check with a P2PKH signature check:

```
<lockPrefix> <pubKeyHash> <blockHeight> <lockSuffix>
```

To unlock:
- Transaction `nLockTime` must be >= the lock's block height
- Input sequence must be 0 (enables nLockTime checking)
- Valid signature from the lock key
- Sighash preimage for script verification

## Lock Storage

Locks are stored in the `locks` basket with tags:

| Tag | Meaning |
|-----|---------|
| `until:{height}` | Block height when the lock matures |

Custom instructions store the protocol and key info for unlocking.

## Minimum Unlock Amount

There is a minimum unlock threshold (`MIN_UNLOCK_SATS`) to prevent dust unlock attempts. If your matured locks total less than this threshold per lock, they won't appear as unlockable.

## Current Block Height

The lock module uses `services.chaintracks.currentHeight()` to determine the current block height. You can also check it directly:

```typescript
const res = await fetch('https://api.1sat.app/1sat/chaintracks/height')
const height = await res.json()
console.log('Current height:', height)
```

## Requirements

```bash
bun add @1sat/actions @1sat/wallet @bsv/sdk
```

Unlock operations require `services` for current block height lookup.
