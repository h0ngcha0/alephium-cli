import { web3, NodeProvider, Project } from '@alephium/web3'
import { CallContractSucceeded } from '@alephium/web3/dist/src/api/api-alephium'
import { Command } from '../../common/command'
import { Args, Flags } from '@oclif/core'
import path from 'path'

export default class Load extends Command {
  static description = 'Load Project'
  static examples = [
    '$ alephium-cli project load <path-to-project-root>',
  ]

  static args = {
    projectRootDir: Args.string({
      description: 'Project Root Directory',
      required: false
    })
  }

  static flags = {
    ...Command.flags,
    group: Flags.integer({
      char: 'g',
      description: 'Group',
      required: true,
      default: 0,
    })
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Load)
    const projectRootDir = path.resolve(args.projectRootDir || '.')
    const contractsRootDir = path.resolve(projectRootDir, 'contracts')
    const artifactsRootDir = path.resolve(projectRootDir, 'artifacts')
    try {
      const nodeUrl = await this.getNodeUrl(flags)
      const nodeProvider = new NodeProvider(nodeUrl)
      web3.setCurrentNodeProvider(nodeProvider)
      await Project.build(undefined, projectRootDir, contractsRootDir, artifactsRootDir)
    } catch (e) {
      console.log(e)
    }
  }
}
