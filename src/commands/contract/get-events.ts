import { subscribeToEvents, SubscribeOptions } from '@alephium/web3'
import { ContractEvent } from '@alephium/web3/dist/src/api/api-alephium'
import { Command } from '../../common'
import { Flags, CliUx } from '@oclif/core'
import { web3 } from '@alephium/web3'

export default class GetEvents extends Command {
  static description = 'Get contract state'
  static examples = [
    '$ alephium-cli contract get-events 2Bhm8HSoxHRRAxY6RvoqWgMJZDBfpSZxyZr7MNkh6HGnC',
  ]

  static args = [{ name: 'address', description: 'Contract Address', required: true }]
  static flags = {
    ...Command.flags,
    streaming: Flags.boolean({
      char: 's',
      description: 'Stream contract events',
      required: false,
      default: false,
    }),
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(GetEvents)

    web3.setCurrentNodeProvider(flags.nodeUrl)
    const nodeProvider = web3.getCurrentNodeProvider()

    if (flags.streaming) {
      const subscriptOptions: SubscribeOptions<ContractEvent> = {
        pollingInterval: 500,
        messageCallback: (event: ContractEvent): Promise<void> => {
          console.log(event)
          return Promise.resolve()
        },
        errorCallback: (error: any, subscription): Promise<void> => {
          console.log(error)
          subscription.unsubscribe()
          return Promise.resolve()
        },
      }

      CliUx.ux.action.start('Fetching events', 'polling', { stdout: true })
      subscribeToEvents(subscriptOptions, args.address)
    } else {
      this.printApiResponse(
        nodeProvider.events.getEventsContractContractaddress(args.address, { start: 0 }),
      )
    }
  }
}
