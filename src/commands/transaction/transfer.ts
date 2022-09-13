import { Command } from '../../common'
import { web3 } from '@alephium/web3'
import { Flags } from '@oclif/core'
import { Token } from '@alephium/web3/dist/src/api/api-alephium'

export default class Transfer extends Command {
  static description = 'Transfer ALPH from source to destination'
  static examples = [
    '$ alephium-cli transaction transfer $destination',
  ]

  static args = [
    { name: 'to', description: 'To address', required: true },
    { name: 'alphAmount', description: 'Amount (atto)', required: true }
  ]

  static flags = {
    ...Command.flags,
    tokenAmounts: Flags.string({
      char: 't',
      description: 'Token amounts, in the format of `tokenId:tokenAmount',
      required: false,
      multiple: true
    }),
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Transfer)

    web3.setCurrentNodeProvider(flags.nodeUrl)
    const signer = await this.getSigner()

    const isHex = (value: string): boolean => /[0-9A-Fa-f]{6}/g.test(value);

    var tokens: Token[] | undefined = []
    if (flags.tokenAmounts) {
      for (const tokenAmount of flags.tokenAmounts) {
        const splitResult: string[] = tokenAmount.split(":")
        if (splitResult.length !== 2) {
          throw new Error(`Token amounts should be in the format of "tokenId:tokenAmount", got: ${tokenAmount}`)
        }

        const id = splitResult[0]
        const amount = splitResult[1]
        if (!(id.length === 64 && isHex(id))) {
          throw new Error(`The format of the token id ${id} is wrong`)
        }

        if (Math.sign(Number(amount)) !== 1) {
          throw new Error(`The format of the token amount ${amount} is wrong`)
        }

        tokens.push({ id, amount })
      }
    } else {
      tokens = undefined
    }

    const accounts = await signer.getAccounts()
    const fromAddress = accounts[0]?.address
    if (fromAddress) {
      console.log(`Transfering from ${fromAddress}`)
      const params = {
        signerAddress: fromAddress,
        destinations: [
          {
            address: args.to,
            attoAlphAmount: args.alphAmount,
            tokens
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
