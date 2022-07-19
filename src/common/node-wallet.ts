import { NodeProvider, NodeWallet } from '@alephium/web3'

export const defaultSignerAddress = '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH'
export function defaultSignerWallet(provider: NodeProvider): Promise<NodeWallet> {
  return signerWallet(provider, 'alephium-web3-test-only-wallet')
}

async function signerWallet(provider: NodeProvider, name: string): Promise<NodeWallet> {
  const wallet = new NodeWallet(provider, name)
  await wallet.unlock('alph')
  return wallet
}
