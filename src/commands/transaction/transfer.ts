import { Args, Flags, ux } from '@oclif/core'
import { Command } from '../../common'
import { Token } from '@alephium/web3/dist/src/api/api-alephium'
import { NodeProvider, web3 } from '@alephium/web3'
import { waitTxConfirmed } from '../../common/utils'

export default class Transfer extends Command {
  static description = 'Transfer ALPH from source to destination'
  static examples = [
    '$ alephium-cli transaction transfer $destination',
  ]

  static args = {
    to: Args.string({
      description: 'To Address',
      required: true
    }),
    alphAmount: Args.string({
      description: 'Amount (atto)',
      required: true
    })
  }

  static flags = {
    ...Command.flags,
    tokenAmounts: Flags.string({
      char: 't',
      description: 'Token amounts, in the format of `tokenId:tokenAmount',
      required: false,
      multiple: true
    }),
    confirmations: Flags.integer({
      char: 'c',
      description: 'Number of confirmations to wait before command returns',
      required: true,
      default: 2
    })
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Transfer)

    const nodeProvider = new NodeProvider(flags.nodeUrl)
    web3.setCurrentNodeProvider(nodeProvider)

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

    const account = await signer.getSelectedAccount()
    const fromAddress = account.address
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

      const transferResult = signer.signAndSubmitTransferTx(params)
      ux.action.start('Transfering tokens', 'Waiting for tx confirmation', { stdout: true })
      await waitTxConfirmed(nodeProvider, (await transferResult).txId, 2, 10000)
      ux.action.stop('Done')
      await this.printApiResponse(transferResult)
    } else {
      throw new Error("Can not find `from` address")
    }
  }
}
