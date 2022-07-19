import { NodeProvider } from '@alephium/web3'
import { AlephiumCommand } from '../../common'

export default class GetState extends AlephiumCommand {
  static description = 'Get contract state'
  static examples = [
    '$ alephium-cli contract get-state 2Bhm8HSoxHRRAxY6RvoqWgMJZDBfpSZxyZr7MNkh6HGnC',
  ]

  static args = [{ name: 'address', description: 'Contract Address', required: true }]
  static flags = { nodeUrl: GetState.nodeUrlFlag }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(GetState)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    await this.printApiResponse(nodeProvider.contracts.getContractsAddressState(args.address, { group: 0 }))
  }
}
