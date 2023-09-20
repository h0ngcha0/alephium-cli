import { groupOfAddress, NodeProvider } from '@alephium/web3'
import { Command } from '../../common/command'
import { Args } from '@oclif/core'
import { tryGetContractAddress } from '../../common'

export default class GetState extends Command {
  static description = 'Get contract state'
  static examples = [
    '$ alephium-cli contract get-state 2Bhm8HSoxHRRAxY6RvoqWgMJZDBfpSZxyZr7MNkh6HGnC',
  ]

  static args = {
    idOrAddress: Args.string({
      description: 'Contract Id or Address',
      required: true
    })
  }

  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(GetState)
    const nodeUrl = await this.getNodeUrl(flags)
    const nodeProvider = new NodeProvider(nodeUrl)
    const address = tryGetContractAddress(args.idOrAddress)
    const group = groupOfAddress(address)
    await this.printApiResponse(nodeProvider.contracts.getContractsAddressState(address, { group }))
  }
}
