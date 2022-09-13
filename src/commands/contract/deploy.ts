import { Fields, Project } from '@alephium/web3'
import { web3 } from '@alephium/web3'
import { Flags } from '@oclif/core'
import { Command } from '../../common'

export default class Deploy extends Command {
  static description = 'Deploy contract'
  static examples = [
    '$ alephium-cli contract deploy path-to-contract',
  ]

  static args = [
    { name: 'sourceFile', description: 'Source file', required: true },
    { name: 'initialFields', description: 'Initial fields for the contracts', required: false },
  ]

  static flags = {
    ...Command.flags,
    issueTokenAmount: Flags.integer({
      char: 't',
      description: 'Issue token amount',
      required: false
    })
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Deploy)
    web3.setCurrentNodeProvider(flags.nodeUrl)

    await Project.build({ errorOnWarnings: false })
    const contract = Project.contract(args.sourceFile)

    const signer = await this.getSigner()
    const signerAddress = await this.getSignerAddress()

    const initialFields = args.initialFields ? JSON.parse(args.initialFields) as Fields : undefined
    const execParams = await contract.paramsForDeployment({
      signerAddress: signerAddress,
      initialFields: initialFields,
      issueTokenAmount: flags.issueTokenAmount
    })
    const submitResult = signer.signDeployContractTx(execParams)
    await this.printApiResponse(submitResult)
  }
}
