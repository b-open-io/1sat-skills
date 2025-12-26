# 1Sat Skills

1Sat Ordinals NFT operations plugin for Claude Code.

## Skills

### Media Extraction
- **extract-blockchain-media** - Extract media files from BSV blockchain transactions using txex CLI

### NFT Operations
- **wallet-create-ordinals** - Mint new ordinals/NFTs on BSV blockchain
- **ordinals-marketplace** - Browse and search 1Sat Ordinals marketplace

## Prerequisites

### CLI Tools

```bash
# Install txex globally for media extraction
bun add -g txex
```

### Packages

- `js-1sat-ord` - 1Sat Ordinals SDK
- `@bsv/sdk` - BSV blockchain SDK

## Installation

```bash
/plugin marketplace add https://github.com/b-open-io/1sat-skills
/plugin install 1sat-skills
```

## Usage

Skills are automatically available after installation. Claude will use them when appropriate for 1Sat Ordinals operations.

## What are 1Sat Ordinals?

1Sat Ordinals are NFTs and inscriptions on the BSV blockchain:
- Store arbitrary data on-chain (images, text, files)
- Unique satoshi-level identification
- Marketplace for trading
- Permanent and immutable storage

## License

MIT
