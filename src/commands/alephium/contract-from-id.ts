import { Command, Flags } from '@oclif/core'
import * as web3 from '@alephium/web3'

export default class ContractFromId extends Command {
  static description = 'Convert address from contract id'

  static examples = [
    `$ oex alephium contract-from-id 01010300010004144020a8ff18caf0ea2eb9c397d7a15c9271cde81f372fd3bc4aae41ff53514b382e3a170016000104`,
  ]

  static args = [{ name: 'id', description: 'ContractId', required: true }]

  async run(): Promise<void> {
    const { args, flags } = await this.parse(ContractFromId)
    this.log(web3.addressFromContractId(args.id))
  }
}
