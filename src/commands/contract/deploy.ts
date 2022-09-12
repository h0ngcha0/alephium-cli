import { Fields, Project } from '@alephium/web3'
import { web3 } from '@alephium/web3'
import { Command, defaultSignerAddress, defaultSignerWallet } from '../../common'

export default class Deploy extends Command {
  static description = 'Deploy contract'
  static examples = [
    '$ alephium-cli contract deploy path-to-contract',
  ]

  static args = [
    { name: 'sourceFile', description: 'Source file', required: true },
    { name: 'initialFields', description: 'Initial fields for the contracts', required: false },
  ]

  static flags = { ...Command.flags }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Deploy)
    web3.setCurrentNodeProvider(flags.nodeUrl)

    // TODO: Make signer & signerAddress configurable
    const signer = await defaultSignerWallet()
    const signerAddress = defaultSignerAddress

    const contract = Project.contract(args.sourceFile)
    const initialFields = args.initialFields ? JSON.parse(args.initialFields) as Fields : undefined
    const execParams = await contract.paramsForDeployment({
      signerAddress: signerAddress,
      initialFields: initialFields,
    })
    const submitResult = signer.signDeployContractTx(execParams)
    await this.printApiResponse(submitResult)
  }
}
