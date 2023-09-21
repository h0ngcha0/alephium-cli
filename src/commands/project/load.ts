import { web3, NodeProvider } from '@alephium/web3'
import { Command } from '../../common/command'
import { Flags } from '@oclif/core'
import path from 'path'
import { loadProject } from '../../common/project'

export default class Load extends Command {
  static description = 'Load Project'
  static examples = [
    '$ alephium-cli project load <path-to-project-root>',
  ]

  static flags = {
    ...Command.flags,
    projectRootDir: Flags.string({
      char: 'p',
      description: 'Project Root Directory',
      required: false
    })
  }

  async execute(): Promise<void> {
    const { flags } = await this.parse(Load)
    const projectRootDir = path.resolve(flags.projectRootDir || '.')
    try {
      const nodeUrl = await this.getNodeUrl(flags)
      const nodeProvider = new NodeProvider(nodeUrl)
      web3.setCurrentNodeProvider(nodeProvider)
      await loadProject(projectRootDir)
      console.log("Project loaded successfully")
    } catch (e) {
      console.log(e)
    }
  }
}
