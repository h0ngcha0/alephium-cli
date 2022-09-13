import { NodeProvider } from '@alephium/web3'
import { Command } from '../../common'

export default class Balance extends Command {
  static description = 'Get the balance for a wallet'
  static args = [{ name: 'walletName', description: 'Wallet Name', required: true }]
  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Balance)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    await this.printApiResponse(nodeProvider.wallets.getWalletsWalletNameBalances(args.walletName))
  }
}
