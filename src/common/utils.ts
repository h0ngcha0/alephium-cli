import { node, addressFromContractId, isBase58, isHexString, NodeProvider, groupOfAddress } from '@alephium/web3'

// const requestInterval = networkId === 'devnet' ? 1000 : 10000
export async function waitTxConfirmed(
  provider: NodeProvider,
  txId: string,
): Promise<node.Confirmed> {
  const status = await provider.transactions.getTransactionsStatus({ txId: txId })
  if (isConfirmed(status) && status.chainConfirmations >= 1) {
    return status
  }
  await new Promise((r) => setTimeout(r, 5000))
  return waitTxConfirmed(provider, txId)
}

function isConfirmed(txStatus: node.TxStatus): txStatus is node.Confirmed {
  return txStatus.type === 'Confirmed'
}

export function tryGetContractAddress(idOrAddress: string): string {
  if (isContractId(idOrAddress)) {
    return addressFromContractId(idOrAddress)
  }
  if (isBase58(idOrAddress)) {
    return idOrAddress
  }
  throw new Error(`Invalid contract id or contract address: ${idOrAddress}`)
}

export function isContractId(str: string) {
  return str.length === 64 && isHexString(str)
}

export function inferArgType(str: string) {
  // Bool
  const booleans = ['true', 'false']
  if (booleans.includes(str.toLowerCase())) {
    return 'Bool'
  }

  // Address
  try {
    groupOfAddress(str)
    return 'Address'
  } catch (e) {
    // ignore
  }

  // I256, U256
  try {
    const num = Number(str)
    if (Number.isInteger(num)) {
      if (num >= 0) {
        return 'U256'
      } else {
        return 'I256'
      }
    }
  } catch (e) {
    // ignore
  }

  // Array
  const isArray = str.trim().startsWith('[') && str.trim().endsWith(']')
  if (isArray) {
    return 'Array'
  }

  // Otherwise, ByteVec
  return 'ByteVec'
}