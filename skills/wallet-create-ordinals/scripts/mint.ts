#!/usr/bin/env bun

import { createOrdinals, fetchPayUtxos } from '@1sat/core'
import { ArcadeClient } from '@1sat/client'
import { ONESAT_MAINNET_URL } from '@1sat/types'
import { PrivateKey, Utils } from '@bsv/sdk'
import { readFile } from 'fs/promises'
import { basename, extname } from 'path'

const { toArray, toBase64 } = Utils

// Get content type from file extension
function getContentType(filePath: string): string {
  const ext = extname(filePath).toLowerCase()
  const types: Record<string, string> = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.json': 'application/json',
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.js': 'text/javascript',
    '.css': 'text/css',
  }
  return types[ext] || 'application/octet-stream'
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.log('Usage: bun run mint.ts <wif> <file-path> [metadata-json]')
    console.log('')
    console.log('Examples:')
    console.log('  bun run mint.ts L1abc... image.png')
    console.log('  bun run mint.ts L1abc... nft.jpg \'{"name":"My NFT","collection":"Test"}\'')
    process.exit(1)
  }

  const [wifStr, filePath, metadataJson] = args

  try {
    // Setup keys
    const privateKey = PrivateKey.fromWif(wifStr)
    const address = privateKey.toAddress().toString()

    console.log(`🔑 Minting from address: ${address}`)

    // Read file
    const fileData = await readFile(filePath)
    const contentType = getContentType(filePath)
    const dataB64 = toBase64(fileData)

    console.log(`📄 File: ${basename(filePath)} (${fileData.length} bytes, ${contentType})`)

    // Parse metadata if provided
    let metadata = null
    if (metadataJson) {
      try {
        metadata = JSON.parse(metadataJson)
        console.log(`📋 Metadata:`, metadata)
      } catch (e) {
        console.error('❌ Invalid metadata JSON:', e.message)
        process.exit(1)
      }
    }

    // Fetch UTXOs
    console.log(`💰 Fetching UTXOs...`)
    const utxos = await fetchPayUtxos(address)

    if (!utxos || utxos.length === 0) {
      console.error('❌ No UTXOs found. Please fund the wallet first.')
      process.exit(1)
    }

    const balance = utxos.reduce((sum, utxo) => sum + utxo.satoshis, 0)
    console.log(`💵 Balance: ${balance} satoshis`)

    // Build inscription
    const inscription: any = {
      dataB64,
      contentType,
    }

    // Add metadata if provided
    if (metadata) {
      inscription.metadata = metadata
    }

    // Create ordinal
    console.log(`🔨 Creating ordinal inscription...`)
    const result = await createOrdinals({
      utxos,
      destinations: [{
        address,
        inscription,
      }],
      paymentPk: privateKey,
      changeAddress: address,
    })

    const txid = result.tx.id('hex')
    console.log(`📝 Transaction created: ${txid}`)
    console.log(`💸 Fee: ${result.fee} satoshis`)

    // Broadcast
    console.log(`📡 Broadcasting to network...`)
    const arcade = new ArcadeClient(ONESAT_MAINNET_URL)
    const broadcastResult = await arcade.submitTransactionHex(result.tx.toHex())

    if (
      broadcastResult.txStatus === 'MINED' ||
      broadcastResult.txStatus === 'SEEN_ON_NETWORK' ||
      broadcastResult.txStatus === 'ACCEPTED_BY_NETWORK' ||
      broadcastResult.txStatus === 'IMMUTABLE'
    ) {
      console.log(`✅ Success! Transaction broadcast.`)
      console.log(``)
      console.log(`🆔 Ordinal ID: ${txid}_0`)
      console.log(`🔗 Transaction: https://whatsonchain.com/tx/${txid}`)
      console.log(`🛍️ Marketplace: https://ordinals.gorillapool.io/inscription?txid=${txid}`)
      console.log(``)
      console.log(`⏱️ Your ordinal will be viewable in ~10 minutes after confirmation.`)
    } else {
      console.error(`❌ Broadcast failed:`, broadcastResult)
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Error:', error.message || error)
    process.exit(1)
  }
}

main()