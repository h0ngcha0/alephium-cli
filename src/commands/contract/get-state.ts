import { NodeProvider } from '@alephium/web3'
import { AlephiumCommand } from '../../alephium-command'

export default class GetState extends AlephiumCommand {
  static description = 'Get contract state'
  static examples = [
    `$ oex alephium contract get-state 01010300010004144020a8ff18caf0ea2eb9c397d7a15c9271cde81f372fd3bc4aae41ff53514b382e3a170016000104`,
  ]

  static args = [{ name: 'address', description: 'Contract Address', required: true }]
  static flags = { nodeUrl: GetState.nodeUrlFlag }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(GetState)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    await this.printApiResponse(nodeProvider.contracts.getContractsAddressState(args.address, { group: 0 }))
  }
}
