---
name: 1sat-cli
description: "This skill should be used when working with the 1Sat CLI tool for BSV operations from the terminal -- running wallet commands, minting ordinals, managing tokens, creating listings, locking BSV, sweeping assets, or managing identity from the command line. Triggers on '1sat CLI', 'command line wallet', '1sat init', '1sat wallet', '1sat ordinals', '1sat tokens', '1sat lock', '1sat sweep', '1sat action', 'bunx @1sat/cli', or 'terminal BSV operations'. Uses @1sat/cli package."
---

# 1Sat CLI

Bun-native command-line interface for 1Sat Ordinals and BSV operations. Binary name: `1sat`.

## Installation

```bash
# Install globally
bun add -g @1sat/cli

# Or run directly without installing
bunx @1sat/cli <command>
```

## Quick Start

```bash
# Initialize wallet and configuration
1sat init

# Check wallet balance
1sat wallet balance

# List ordinals in wallet
1sat ordinals list

# Send BSV
1sat wallet send --to 1Address... --amount 50000
```

## Configuration

Config directory: `~/.1sat/`

### Key Management

Keys can be provided in three ways:

1. **Secure Enclave** (macOS arm64): Hardware-protected via `@1sat/vault` — keys encrypted with SE P-256 key, decryption requires Touch ID. Used by `bap touchid enable` and `clawnet setup-key`.
2. **Environment variable**: Set `PRIVATE_KEY_WIF` with your WIF private key
3. **Encrypted keystore**: Stored at `~/.1sat/keys.bep` (created during `1sat init`)

```bash
# Using env var
PRIVATE_KEY_WIF=L1abc... 1sat wallet balance

# Using encrypted keystore (created by init)
1sat init
1sat wallet balance
```

## Commands

### Wallet

```bash
1sat wallet balance              # Show BSV balance
1sat wallet send                 # Send BSV to address
1sat wallet send-all             # Send entire balance
1sat wallet utxos                # List payment UTXOs
```

### Ordinals

```bash
1sat ordinals list               # List ordinals in wallet
1sat ordinals inscribe           # Inscribe a file as ordinal
1sat ordinals transfer           # Transfer ordinal to recipient
```

### Marketplace (OrdLock)

```bash
1sat ordinals list-for-sale      # List ordinal for sale
1sat ordinals cancel-listing     # Cancel an active listing
1sat ordinals purchase           # Purchase a listed ordinal
```

### Tokens (BSV21)

```bash
1sat tokens balances             # Show all token balances
1sat tokens list                 # List token UTXOs
1sat tokens send                 # Send tokens to recipient
```

### Locks (Timelock)

```bash
1sat locks status                # Show lock summary
1sat locks create                # Lock BSV until block height
1sat locks unlock                # Unlock all matured locks
```

### Identity (BAP)

```bash
1sat identity publish            # Publish BAP identity
1sat identity profile            # View/update profile
1sat identity attest             # Publish attestation
```

### Social (BSocial)

```bash
1sat social post                 # Create a social post
1sat social search               # Search posts
```

### OpNS Names

```bash
1sat opns register               # Register identity on OpNS name
1sat opns deregister             # Remove identity binding
```

### Sweep / Import

```bash
1sat sweep bsv                   # Sweep BSV from external WIF
1sat sweep ordinals              # Sweep ordinals from external WIF
1sat sweep tokens                # Sweep BSV21 tokens from external WIF
```

### Action Escape Hatch

Any registered action can be invoked directly by name with a JSON input:

```bash
# Run any action from the action registry
1sat action <name> <json>

# Examples
1sat action sendBsv '{"requests":[{"address":"1A...","satoshis":5000}]}'
1sat action lockBsv '{"requests":[{"satoshis":10000,"until":900000}]}'
1sat action inscribe '{"base64Content":"SGVsbG8=","contentType":"text/plain"}'
```

This is the escape hatch for any operation supported by the `@1sat/actions` registry, even those without dedicated CLI subcommands.

## Output Modes

```bash
# JSON output (for scripting/piping)
1sat wallet balance --json

# Quiet mode (minimal output)
1sat wallet send --to 1A... --amount 5000 --quiet

# Auto-confirm prompts (non-interactive)
1sat wallet send --to 1A... --amount 5000 --yes
```

## Init Flow

```bash
1sat init
```

The init command:
1. Prompts for network selection (mainnet/testnet)
2. Generates or imports a private key (WIF)
3. Encrypts and stores the key at `~/.1sat/keys.bep`
4. Writes config to `~/.1sat/config.json`
5. Tests connectivity to `api.1sat.app`

## Requirements

- Bun runtime (not Node.js)
- Network access to `api.1sat.app`

## Package

```bash
bun add -g @1sat/cli
```

The CLI wraps `@1sat/actions`, `@1sat/wallet-node`, and `@1sat/client` into a single command-line interface.
