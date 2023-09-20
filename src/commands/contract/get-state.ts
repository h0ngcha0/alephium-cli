import { NodeProvider } from '@alephium/web3'
import { Command } from '../../common'
import { Args } from '@oclif/core'

export default class GetState extends Command {
  static description = 'Get contract state'
  static examples = [
    '$ alephium-cli contract get-state 2Bhm8HSoxHRRAxY6RvoqWgMJZDBfpSZxyZr7MNkh6HGnC',
  ]

  static args = {
    address: Args.string({
      description: 'Contract Address',
      required: true
    })
  }

  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(GetState)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    await this.printApiResponse(nodeProvider.contracts.getContractsAddressState(args.address, { group: 0 }))
  }
}
