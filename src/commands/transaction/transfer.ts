import { Command, defaultSignerWallet } from '../../common'
import { web3 } from '@alephium/web3'

export default class Transfer extends Command {
  static description = 'Transfer ALPH from source to destination'
  static examples = [
    '$ alephium-cli transaction transfer $destination',
  ]

  static args = [
    { name: 'to', description: 'To address', required: true },
    { name: 'amount', description: 'Amount (atto)', required: true }
  ]

  static flags = {
    ...Command.flags,
  }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Transfer)
    web3.setCurrentNodeProvider(flags.nodeUrl)

    const signer = await defaultSignerWallet()

    if (signer.accounts && signer.accounts[0]) {
      console.log(`Transfering from ${signer.accounts[0].address}`)
      const params = {
        signerAddress: signer.accounts[0].address,
        destinations: [
          {
            address: args.to,
            attoAlphAmount: args.amount
          }
        ]
      }

      const transferResult = signer.signTransferTx(params)
      await this.printApiResponse(transferResult)
    } else {
      throw new Error("Can not find `from` address")
    }
  }
}
