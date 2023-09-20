import { NodeProvider } from '@alephium/web3'
import { Command } from '../../common'
import { Args } from '@oclif/core'

export default class Balance extends Command {
  static description = 'Get the balance for an address'
  static args = {
    address: Args.string({
      description: 'Address',
      required: true
    })
  }
  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Balance)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    await this.printApiResponse(nodeProvider.addresses.getAddressesAddressBalance(args.address))
  }
}
