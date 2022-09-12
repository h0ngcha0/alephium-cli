import { Project } from '@alephium/web3'
import { web3 } from '@alephium/web3'
import { Command } from '../../common'

export default class Compile extends Command {
  static description = 'Compile contract'
  static examples = [
    '$ alephium-cli contract compile path-to-contract',
  ]

  static args = [{ name: 'sourceFile', description: 'Source file', required: true }]
  static flags = { ...Command.flags }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Compile)
    web3.setCurrentNodeProvider(flags.nodeUrl)
    const compiled = Promise.resolve(Project.contract(args.sourceFile))
    await this.printApiResponse(compiled)
  }
}
