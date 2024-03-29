import { Args, Flags, ux } from '@oclif/core'
import { Command } from '../../common/command'
import { TxStatus } from '@alephium/web3/dist/src/api/api-alephium'
import { web3, subscribeToTxStatus, SubscribeOptions, TxStatusSubscription, NodeProvider } from '@alephium/web3'

export default class GetStatus extends Command {
  static description = 'Get transaction status'
  static examples = [
    '$ alephium-cli transaction get-status 2Bhm8HSoxHRRAxY6RvoqWgMJZDBfpSZxyZr7MNkh6HGnC',
  ]

  static args = {
    txId: Args.string({
      description: 'Transaction Id',
      required: true
    })
  }

  static flags = {
    ...Command.flags,
    streaming: Flags.boolean({
      char: 's',
      description: 'Stream transaction status',
      required: false,
      default: false,
    }),
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(GetStatus)
    const nodeUrl = await this.getNodeUrl(flags)
    const nodeProvider = new NodeProvider(nodeUrl)

    let subscription: TxStatusSubscription | undefined

    if (flags.streaming) {
      web3.setCurrentNodeProvider(nodeProvider)
      const subscriptOptions: SubscribeOptions<TxStatus> = {
        pollingInterval: 500,
        messageCallback: (status: TxStatus): Promise<void> => {
          console.log(status)

          if ((status.type === 'Confirmed' || status.type === 'TxNotFound') && subscription) {
            subscription.unsubscribe()
          }

          return Promise.resolve()
        },
        errorCallback: (error: any, subscription): Promise<void> => {
          console.log(error)
          subscription.unsubscribe()
          return Promise.resolve()
        },
      }

      ux.action.start('Fetching transaction status', undefined, { stdout: true })
      subscription = subscribeToTxStatus(subscriptOptions, args.txId)
    } else {
      this.printApiResponse(
        nodeProvider.transactions.getTransactionsStatus({ txId: args.txId }),
      )
    }
  }
}
