import { NodeProvider } from '@alephium/web3'
import { Flags } from '@oclif/core'
import { Command } from '../../common'

export default class Create extends Command {
  static description = 'Create a new wallets'
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
    }),
    isMiner: Flags.boolean({
      char: 'm',
      description: 'Whether a miner wallet',
      required: false
    }),
    mnemonicPassphrase: Flags.string({
      char: 's',
      description: 'Mnemonic passphrase',
      required: false
    }),
    mnemonicSize: Flags.integer({
      char: 'z',
      description: 'Mnemonic size',
      required: false
    })
  }

  override async execute(): Promise<void> {
    const { flags } = await this.parse(Create)
    const nodeProvider = new NodeProvider(flags.nodeUrl)

    try {
      await nodeProvider.wallets.getWalletsWalletName(flags.name)
      console.info(`${flags.name} already exists`)
    } catch (e) {
      const detail = (e as { error: { detail: string } }).error.detail
      if (detail.endsWith("not found")) {
        const result = nodeProvider.wallets.postWallets({
          "password": flags.password,
          "walletName": flags.name,
          "isMiner": flags.isMiner,
          "mnemonicPassphrase": flags.mnemonicPassphrase,
          "mnemonicSize": flags.mnemonicSize
        })
        await this.printApiResponse(result)
      } else {
        console.info(e)
      }
    }
  }
}
