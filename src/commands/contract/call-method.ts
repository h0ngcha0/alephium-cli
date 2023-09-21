import { web3, NodeProvider, groupOfAddress } from '@alephium/web3'
import { Command } from '../../common/command'
import { Args } from '@oclif/core'
import { callMethod, parseMethodArgs } from '../../common'

export default class CallMethod extends Command {
  static description = 'Call Method'
  static examples = [
    '$ alephium-cli contract call-method ${address} ${methodIndex} ${args}',
  ]

  static args = {
    address: Args.string({
      description: 'Contract Address',
      required: true
    }),
    methodIndex: Args.integer({
      description: 'Method Index',
      required: true
    }),
    methodArgs: Args.string({
      description: 'Method Arguments',
      required: true
    })
  }

  static flags = {
    ...Command.flags
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(CallMethod)
    try {
      const nodeUrl = await this.getNodeUrl(flags)
      const nodeProvider = new NodeProvider(nodeUrl)
      web3.setCurrentNodeProvider(nodeProvider)

      const methodArgs = parseMethodArgs(args.methodArgs)
      const address = args.address
      const group = groupOfAddress(address)
      const methodIndex = args.methodIndex

      await callMethod(nodeProvider, address, group, methodIndex, methodArgs)
    } catch (e) {
      console.error(e)
    }
  }
}
