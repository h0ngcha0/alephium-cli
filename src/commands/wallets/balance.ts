import { NodeProvider } from '@alephium/web3'
import { AlephiumCommand } from '../../alephium-command'

export default class Balance extends AlephiumCommand {
  static description = 'Get the balance for a wallet'
  static args = [{ name: 'walletName', description: 'Wallet Name', required: true }]
  static flags = { nodeUrl: Balance.nodeUrlFlag }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Balance)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    await this.printApiResponse(nodeProvider.wallets.getWalletsWalletNameBalances(args.walletName))
  }
}
