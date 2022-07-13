import { Command, Flags } from '@oclif/core'
import { NodeProvider } from '@alephium/web3'

export default class Balance extends Command {
  static description = 'Get the balance for a wallet'

  static examples = [
    `$ oex alephium wallets balance wallet-name`,
  ]

  static args = [{ name: 'walletName', description: 'Wallet Name', required: true }]
  static flags = {
    nodeUrl: Flags.string({ char: 'n', description: 'Node URL', required: false, default: "http://127.0.0.1:22973" }),
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Balance)
    const nodeProvider = new NodeProvider(flags.nodeUrl)

    await nodeProvider.wallets.getWalletsWalletNameBalances(args.walletName)
      .then(state => {
        this.log(JSON.stringify(state))
      })
      .catch(e => {
        console.error(e)
      })
  }
}
