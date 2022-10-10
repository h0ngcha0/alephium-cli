import { Project } from '@alephium/web3'
import { web3 } from '@alephium/web3'
import { Command } from '../../common'

export default class Compile extends Command {
  static description = 'Compile contract'
  static examples = [
    '$ alephium-cli project compile path-to-contract',
  ]

  static args = [{ name: 'sourceFile', description: 'Source file', required: true }]
  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Compile)

    web3.setCurrentNodeProvider(flags.nodeUrl)
    await Project.build({ errorOnWarnings: false })

    const compiled = Promise.resolve(Project.contract(args.sourceFile))
    await this.printApiResponse(compiled)
  }
}