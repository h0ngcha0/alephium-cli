import { Command, Flags } from '@oclif/core'
import { NodeProvider } from '@alephium/web3'

export default class List extends Command {
  static description = 'List all the wallets'

  static examples = [
    `$ oex alephium wallets list`,
  ]

  static args = []
  static flags = {
    nodeUrl: Flags.string({ char: 'n', description: 'Node URL', required: false, default: "http://127.0.0.1:22973" }),
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(List)

    const nodeProvider = new NodeProvider(flags.nodeUrl)

    await nodeProvider.wallets.getWallets()
      .then(state => {
        this.log(JSON.stringify(state))
      })
      .catch(e => {
        console.error(e)
      })
  }
}
