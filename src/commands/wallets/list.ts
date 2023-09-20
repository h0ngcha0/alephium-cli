import { NodeProvider } from '@alephium/web3'
import { Command } from '../../common/command'

export default class List extends Command {
  static description = 'List all the wallets'
  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { flags } = await this.parse(List)
    const nodeUrl = await this.getNodeUrl(flags)
    const nodeProvider = new NodeProvider(nodeUrl)
    await this.printApiResponse(nodeProvider.wallets.getWallets())
  }
}
