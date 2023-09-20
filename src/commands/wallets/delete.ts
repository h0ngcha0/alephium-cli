import { NodeProvider } from '@alephium/web3'
import { Flags } from '@oclif/core'
import { Command } from '../../common/command'

export default class Delete extends Command {
  static description = 'Delete a wallet'
  static flags = {
    ...Command.flags,
    name: Flags.string({
      char: 'w',
      description: 'Wallet name',
      required: true
    }),
    password: Flags.string({
      char: 'p',
      description: 'Password',
      required: true
    })
  }

  override async execute(): Promise<void> {
    const { flags } = await this.parse(Delete)
    const nodeUrl = await this.getNodeUrl(flags)
    const nodeProvider = new NodeProvider(nodeUrl)

    try {
      const result = nodeProvider.wallets.deleteWalletsWalletName(
        flags.name,
        {
          "password": flags.password
        }
      )
      await this.printApiResponse(result)
    } catch (e) {
      console.info(e)
    }
  }
}
