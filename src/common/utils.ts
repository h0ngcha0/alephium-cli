import { node, NodeProvider } from "@alephium/web3"

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
