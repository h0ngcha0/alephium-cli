import { NodeProvider, Contract, Fields } from '@alephium/web3'
import { AlephiumCommand, defaultSignerAddress, defaultSignerWallet } from '../../common'

export default class Deploy extends AlephiumCommand {
  static description = 'Deploy contract'
  static examples = [
    '$ alephium-cli deploy path-to-contract',
  ]

  static args = [
    { name: 'sourceFile', description: 'Source file', required: true },
    { name: 'initialFields', description: 'Initial fields for the contracts', required: false },
  ]

  static flags = { nodeUrl: Deploy.nodeUrlFlag }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Deploy)
    const nodeProvider = new NodeProvider(flags.nodeUrl)

    // TODO: Make signer & signerAddress configurable
    const signer = await defaultSignerWallet(nodeProvider)
    const signerAddress = defaultSignerAddress

    const contract = await Contract.fromSource(nodeProvider, args.sourceFile)
    const initialFields = args.initialFields ? JSON.parse(args.initialFields) as Fields : undefined
    const execParams = await contract.paramsForDeployment({
      signerAddress: signerAddress,
      initialFields: initialFields,
    })
    const submitResult = signer.signDeployContractTx(execParams)
    await this.printApiResponse(submitResult)
  }
}
