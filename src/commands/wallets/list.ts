import { NodeProvider } from '@alephium/web3'
import { AlephiumCommand } from '../../alephium-command'

export default class List extends AlephiumCommand {
  static description = 'List all the wallets'
  static flags = { nodeUrl: List.nodeUrlFlag }

  async run(): Promise<void> {
    const { flags } = await this.parse(List)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    await this.printApiResponse(nodeProvider.wallets.getWallets())
  }
}
