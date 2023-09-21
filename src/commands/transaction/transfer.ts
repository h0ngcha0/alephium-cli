import { Args, Flags, ux } from '@oclif/core'
import { Command } from '../../common/command'
import { DUST_AMOUNT, NodeProvider, web3 } from '@alephium/web3'
import { waitTxConfirmed } from '../../common'
import { parseTokens } from '../../common/utils'

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
    const tokens = flags.tokenAmounts && parseTokens(flags.tokenAmounts)
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
