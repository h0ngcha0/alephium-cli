import { NodeWallet } from '@alephium/web3-wallet'

export const defaultSignerAddress = '1DrDyTr9RpRsQnDnXo2YRiPzPW4ooHX5LLoqXrqfMrpQH'
export function defaultSignerWallet(): Promise<NodeWallet> {
  return signerWallet('alephium-web3-test-only-wallet')
}

async function signerWallet(name: string): Promise<NodeWallet> {
  const wallet = new NodeWallet(name)
  await wallet.unlock('alph')
  return wallet
}
