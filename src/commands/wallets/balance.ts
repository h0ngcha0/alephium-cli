import { NodeProvider } from '@alephium/web3'
import { Command } from '../../common/command'
import { Args } from '@oclif/core'

export default class Balance extends Command {
  static description = 'Get the balance for a wallet'

  static args = {
    walletName: Args.string({
      description: 'Wallet Name',
      required: true
    })
  }

  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Balance)
    const nodeUrl = await this.getNodeUrl(flags)
    const nodeProvider = new NodeProvider(nodeUrl)
    await this.printApiResponse(nodeProvider.wallets.getWalletsWalletNameBalances(args.walletName))
  }
}
