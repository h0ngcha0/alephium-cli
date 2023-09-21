import { web3, NodeProvider, Project } from '@alephium/web3'
import { Command } from '../../common/command'
import { Args, Flags } from '@oclif/core'
import path from 'path'
import { loadProject } from '../../common/project'

export default class ShowContractMethods extends Command {
  static description = 'Show Contract Methods'
  static examples = [
    '$ alephium-cli project inspect-contract <contract-name>',
  ]

  static args = {
    contractName: Args.string({
      description: 'Contract Name',
      required: true
    })
  }

  static flags = {
    ...Command.flags,
    projectRootDir: Flags.string({
      char: 'p',
      description: 'Project Root Directory',
      required: false
    })
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(ShowContractMethods)
    const projectRootDir = path.resolve(flags.projectRootDir || '.')
    try {
      const nodeUrl = await this.getNodeUrl(flags)
      const nodeProvider = new NodeProvider(nodeUrl)
      web3.setCurrentNodeProvider(nodeProvider)
      await loadProject(projectRootDir)

      const contract = Project.contract(args.contractName)
      const publicFunctions = contract.publicFunctions()
      contract.functions.forEach((func, index) => {
        const args = []
        for (let i = 0; i < func.paramTypes.length; i++) {
          args.push(`${func.paramNames[i]}: ${func.paramTypes[i]}`)
        }
        let returns = '()'
        if (func.returnTypes.length === 1) {
          returns = func.returnTypes[0]
        } else if (func.returnTypes.length > 1) {
          returns = `(${func.returnTypes.join(', ')})`
        }
        let pubModifier = publicFunctions.includes(func.name) ? 'pub ' : ''
        console.log(`[${index}] ${pubModifier}fn ${func.name}(${args.join(', ')}) -> ${returns}`)
      })
    } catch (e) {
      console.log(e)
    }
  }
}
