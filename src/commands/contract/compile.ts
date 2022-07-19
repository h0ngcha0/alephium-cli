import { NodeProvider, Contract } from '@alephium/web3'
import { AlephiumCommand } from '../../common'

export default class Compile extends AlephiumCommand {
  static description = 'Compile contract'
  static examples = [
    '$ alephium-cli compile path-to-contract',
  ]

  static args = [{ name: 'sourceFile', description: 'Source file', required: true }]
  static flags = { nodeUrl: Compile.nodeUrlFlag }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Compile)
    const nodeProvider = new NodeProvider(flags.nodeUrl)
    const compiled = Contract.fromSource(nodeProvider, args.sourceFile)
    await this.printApiResponse(compiled)
  }
}
