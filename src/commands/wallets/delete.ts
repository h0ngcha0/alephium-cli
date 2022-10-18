import { NodeProvider } from '@alephium/web3'
import { Flags } from '@oclif/core'
import { Command } from '../../common'

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
    const nodeProvider = new NodeProvider(flags.nodeUrl)

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
