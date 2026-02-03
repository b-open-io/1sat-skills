# 1Sat Skills

1Sat Ordinals operations for Claude Code. NFT minting, media extraction, and marketplace browsing.

## Installation

```bash
bunx skills add b-open-io/1sat-skills --skill extract-blockchain-media
bunx skills add b-open-io/1sat-skills --skill wallet-create-ordinals
bunx skills add b-open-io/1sat-skills --skill ordinals-marketplace
```

## Skills

| Skill | Description |
|-------|-------------|
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
bun add js-1sat-ord @bsv/sdk
```

Note: `js-1sat-ord` is being migrated to `@1sat/sdk` (in progress).

## Related

- **@1sat/wallet-toolbox** - BRC-100 wallet with ordinals support
- **bsv-skills** - Core BSV wallet and transaction skills
- **1Sat Ordinals Docs**: https://docs.1satordinals.com/
- **GorillaPool Marketplace**: https://ordinals.gorillapool.io

## What are 1Sat Ordinals?

NFTs and inscriptions on BSV:
- Arbitrary data stored on-chain (images, text, files)
- Unique satoshi-level identification
- Permanent, immutable storage
- Active marketplace for trading

## License

MIT
