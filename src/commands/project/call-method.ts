import { web3, NodeProvider, Project } from '@alephium/web3'
import { Command } from '../../common/command'
import { Args, Flags } from '@oclif/core'
import path from 'path'
import { loadProject } from '../../common/project'
import { parseMethodCall, callMethod } from '../../common'

export default class CallMethod extends Command {
  static description = 'Call Method'
  static examples = [
    '$ alephium-cli project call-method "Foo.bar(a, b)"',
  ]

  static args = {
    methodCall: Args.string({
      description: 'Method Call',
      required: true
    })
  }

  static flags = {
    ...Command.flags,
    projectRootDir: Flags.string({
      char: 'p',
      description: 'Project Root Directory',
      required: false
    }),
    group: Flags.integer({
      char: 'g',
      description: 'Group',
      required: true,
      default: 0,
    })
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(CallMethod)
    const projectRootDir = path.resolve(flags.projectRootDir || '.')
    const artifactsRootDir = path.resolve(projectRootDir, 'artifacts')
    try {
      const nodeUrl = await this.getNodeUrl(flags)
      const nodeProvider = new NodeProvider(nodeUrl)
      web3.setCurrentNodeProvider(nodeProvider)
      await loadProject(projectRootDir)

      const parsedMethodCall = parseMethodCall(args.methodCall)
      const contract = Project.contract(parsedMethodCall.contractName)
      const deployments = await import(path.resolve(artifactsRootDir, `.deployments.${flags.network}.json`))
      const contractInstance = deployments.contracts[parsedMethodCall.contractName].contractInstance
      const address = contractInstance.address
      const group = contractInstance.groupIndex
      const methodIndex = contract.getMethodIndex(parsedMethodCall.methodName)
      await callMethod(nodeProvider, address, group, methodIndex, parsedMethodCall.args)
    } catch (e) {
      console.error(e)
    }
  }
}
