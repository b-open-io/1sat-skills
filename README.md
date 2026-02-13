# 1Sat Skills

1Sat ecosystem tools for Claude Code. Unified BSV indexing API, ordinals NFT operations, media extraction, and marketplace browsing.

## Installation

```bash
bunx skills add b-open-io/1sat-skills --skill 1sat-stack
bunx skills add b-open-io/1sat-skills --skill extract-blockchain-media
bunx skills add b-open-io/1sat-skills --skill wallet-create-ordinals
bunx skills add b-open-io/1sat-skills --skill ordinals-marketplace
```

## Skills

| Skill | Description |
|-------|-------------|
| `1sat-stack` | Unified BSV indexing API - replaces all other indexers |
| `extract-blockchain-media` | Extract media files from blockchain transactions using txex |
| `wallet-create-ordinals` | Mint new ordinals/inscriptions on BSV |
| `ordinals-marketplace` | Browse and search GorillaPool marketplace |

## Prerequisites

**CLI Tools**

```bash
# Install txex globally for media extraction
bun add -g txex
```

**Packages**

```bash
# For ordinals operations
bun add @1sat/core @1sat/client @1sat/types @bsv/sdk

# For browser dApps (optional)
bun add @1sat/connect

# For React apps (optional)
bun add @1sat/react
```

Note: The old `js-1sat-ord` package has been replaced by the `@1sat/sdk` monorepo packages.

## Related

- **@1sat/sdk** - Official 1Sat SDK monorepo with all packages
- **@1sat/wallet** - BRC-100 wallet engine with ordinals support
- **bsv-skills** - Core BSV wallet and transaction skills
- **1Sat Ordinals Docs**: https://docs.1satordinals.com/
- **1sat.market**: https://1sat.market - Ordinals marketplace and wallet
- **GorillaPool Marketplace**: https://ordinals.gorillapool.io

## What are 1Sat Ordinals?

NFTs and inscriptions on BSV:
- Arbitrary data stored on-chain (images, text, files)
- Unique satoshi-level identification
- Permanent, immutable storage
- Active marketplace for trading

## License

MIT
