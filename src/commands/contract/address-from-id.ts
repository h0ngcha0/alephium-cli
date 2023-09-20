import * as web3 from '@alephium/web3'
import { Args, Command } from '@oclif/core'

export default class AddressFromId extends Command {
  static description = 'Convert contract id to address'
  static examples = [
    '$ alephium-cli contract address-from-id 01010300010004144020a8ff18caf0ea2eb9c397d7a15c9271cde81f372fd3bc4aae41ff53514b382e3a170016000104',
  ]

  static args = {
    id: Args.string({
      description: 'Contract Id',
      required: true
    })
  }

  async run(): Promise<void> {
    const { args } = await this.parse(AddressFromId)
    this.log(web3.addressFromContractId(args.id))
  }
}
