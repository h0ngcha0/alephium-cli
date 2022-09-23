import { web3, Project } from '@alephium/web3'
import { Command } from '../../common'

export default class Build extends Command {
  static description = 'Build project'
  static examples = [
    '$ alephium-cli project build',
  ]

  static args = [
    { name: 'contractsRootPath', description: 'Root path for the contracts', required: false, default: "contracts" },
    { name: 'artifactsRootPath', description: 'Root path for the artifacts', required: false, default: "artifacts" },
  ]
  static flags = { ...Command.flags }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Build)
    web3.setCurrentNodeProvider(flags.nodeUrl)
    await Project.build({ errorOnWarnings: false }, args.contractsRootPath, args.artifactsRootPath)
    console.log("Project compiled")
  }
}
