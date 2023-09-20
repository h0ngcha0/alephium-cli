import { Args, Flags, ux } from '@oclif/core'
import { Command } from '../../common/command'
import { Token } from '@alephium/web3/dist/src/api/api-alephium'
import { DUST_AMOUNT, NodeProvider, web3 } from '@alephium/web3'
import { isContractId, waitTxConfirmed } from '../../common'

export default class Transfer extends Command {
  static description = 'Transfer ALPH from source to destination'
  static examples = [
    '$ alephium-cli transaction transfer $destination',
  ]

  static args = {
    to: Args.string({
      description: 'To Address',
      required: true
    })
  }

  static flags = {
    ...Command.flags,
    alphAmount: Flags.string({
      char: 'a',
      description: 'Amount (atto)',
      required: false
    }),
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
    const nodeUrl = await this.getNodeUrl(flags)
    const nodeProvider = new NodeProvider(nodeUrl)
    web3.setCurrentNodeProvider(nodeProvider)

    const signer = await this.getSigner()

    var tokens: Token[] | undefined = []
    if (flags.tokenAmounts) {
      for (const tokenAmount of flags.tokenAmounts) {
        const splitResult: string[] = tokenAmount.split(":")
        if (splitResult.length !== 2) {
          throw new Error(`Token amounts should be in the format of "tokenId:tokenAmount", got: ${tokenAmount}`)
        }

        const id = splitResult[0]
        const amount = splitResult[1]
        if (!(isContractId(id))) {
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

    if (!flags.alphAmount && !tokens) {
      throw new Error("alphAmount and tokenAmounts can not be both unspecified")
    }

    const fromAddress = account.address
    if (fromAddress) {
      ux.action.start(`Transfering from ${fromAddress} to ${args.to}`, undefined, { stdout: true })
      const params = {
        signerAddress: fromAddress,
        destinations: [
          {
            address: args.to,
            attoAlphAmount: flags.alphAmount || DUST_AMOUNT,
            tokens
          }
        ]
      }

      try {
        const transferResult = await signer.signAndSubmitTransferTx(params)
        ux.action.start('Waiting for tx confirmation', undefined, { stdout: true })
        await waitTxConfirmed(nodeProvider, transferResult.txId)
        ux.action.stop('Done')
        this.log(JSON.stringify(transferResult, null, 2))
      } catch (e) {
        console.error(e)
      }
    } else {
      throw new Error("Can not find `from` address")
    }
  }
}
