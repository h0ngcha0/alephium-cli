import { Fields, Project } from '@alephium/web3'
import { web3 } from '@alephium/web3'
import { Command, defaultSignerAddress, defaultSignerWallet } from '../../common'

export default class Execute extends Command {
  static description = 'Execute script'
  static examples = [
    '$ alephium-cli script execute path-to-script',
  ]

  static args = [
    { name: 'sourceFile', description: 'Source file', required: true },
    { name: 'initialFields', description: 'Initial fields for the script', required: false },
  ]

  static flags = { ...Command.flags }

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Execute)

    web3.setCurrentNodeProvider(flags.nodeUrl)

    // TODO: Make signer & signerAddress configurable
    const signer = await defaultSignerWallet()
    const signerAddress = defaultSignerAddress

    const script = Project.script(args.sourceFile)
    const initialFields = args.initialFields ? JSON.parse(args.initialFields) as Fields : undefined
    const execParams = await script.paramsForDeployment({
      signerAddress: signerAddress,
      initialFields: initialFields,
    })
    const submitResult = signer.signExecuteScriptTx(execParams)
    await this.printApiResponse(submitResult)
  }
}
