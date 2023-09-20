import { web3, NodeProvider, Project } from '@alephium/web3'
import { CallContractSucceeded } from '@alephium/web3/dist/src/api/api-alephium'
import { Command } from '../../common/command'
import { Args, Flags } from '@oclif/core'
import path from 'path'

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
    const contractsRootDir = path.resolve(projectRootDir, 'contracts')
    const artifactsRootDir = path.resolve(projectRootDir, 'artifacts')
    try {
      const nodeUrl = await this.getNodeUrl(flags)
      const nodeProvider = new NodeProvider(nodeUrl)
      web3.setCurrentNodeProvider(nodeProvider)
      await Project.build(undefined, projectRootDir, contractsRootDir, artifactsRootDir)

      const contract = Project.contract('FriendTech')
      const methodCallRegex = /(\w*)\.(\w*)\(([^)]*)\)/;
      const matches = methodCallRegex.exec(args.methodCall)
      if (matches) {
        const contractName = matches[1].trim();
        const methodName = matches[2].trim();
        let methodArgs = undefined
        try {
          const rawMethodArgs = matches[3].split(',').map(arg => arg.trim());
          methodArgs = rawMethodArgs.map((args) => {
            const splitted = args.split(':')
            return { type: splitted[1], value: splitted[0] }
          })
        } catch (e) {
          console.error(`Method Args ${matches[3]} are not formatted correctly: ${e}`)
        }

        const deployments = await import(path.resolve(artifactsRootDir, `.deployments.${flags.network}.json`))

        const address = deployments.contracts[contractName].contractInstance.address
        const group = deployments.contracts[contractName].contractInstance.groupIndex
        const methodIndex = contract.getMethodIndex(methodName)

        const result = await nodeProvider.contracts.postContractsCallContract({
          address,
          group,
          methodIndex,
          args: methodArgs
        })

        if (result.type === 'CallContractSucceeded') {
          console.log((result as CallContractSucceeded).returns[0].value)
        } else if (result.type === 'CallContractFailed') {
          console.error(result)
        }
      } else {
        console.error("args.methodCall is not formatted correctly")
      }
    } catch (e) {
      console.error(e)
    }
  }
}
