import { Fields, Project } from '@alephium/web3'
import { web3 } from '@alephium/web3'
import { Command } from '../../common'

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

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(Execute)
    web3.setCurrentNodeProvider(flags.nodeUrl)

    await Project.build({ errorOnWarnings: false })
    const script = Project.script(args.sourceFile)

    const signer = await this.getSigner()
    const signerAddress = await this.getSignerAddress()

    const initialFields = args.initialFields ? JSON.parse(args.initialFields) as Fields : undefined
    const execParams = await script.paramsForDeployment({
      signerAddress: signerAddress,
      initialFields: initialFields,
    })
    const submitResult = signer.signExecuteScriptTx(execParams)
    await this.printApiResponse(submitResult)
  }
}
