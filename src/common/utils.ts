import { node, addressFromContractId, isBase58, isHexString, NodeProvider } from '@alephium/web3'

// const requestInterval = networkId === 'devnet' ? 1000 : 10000
export async function waitTxConfirmed(
  provider: NodeProvider,
  txId: string,
  confirmations: number,
  requestInterval: number
): Promise<node.Confirmed> {
  const status = await provider.transactions.getTransactionsStatus({ txId: txId })
  if (isConfirmed(status) && status.chainConfirmations >= confirmations) {
    return status
  }
  await new Promise((r) => setTimeout(r, requestInterval))
  return waitTxConfirmed(provider, txId, confirmations, requestInterval)
}

function isConfirmed(txStatus: node.TxStatus): txStatus is node.Confirmed {
  return txStatus.type === 'Confirmed'
}

export function tryGetContractAddress(idOrAddress: string): string {
  if (idOrAddress.length === 64 && isHexString(idOrAddress)) {
    return addressFromContractId(idOrAddress)
  }
  if (isBase58(idOrAddress)) {
    return idOrAddress
  }
  throw new Error(`Invalid contract id or contract address: ${idOrAddress}`)
}
