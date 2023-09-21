import { web3, NodeProvider, Project, DUST_AMOUNT } from '@alephium/web3'
import { Command } from '../../common/command'
import { Args, Flags, ux } from '@oclif/core'
import path from 'path'
import { loadProject } from '../../common/project'
import { parseScriptMethodCall, parseTokens, waitTxConfirmed } from '../../common'
import { NamedVals } from '@alephium/web3/dist/src/api'

export default class CallTxScript extends Command {
  static description = 'Call TxScript'
  static examples = [
    '$ alephium-cli project call-script "Foo(a, b)"',
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
    }),
    alphAmount: Flags.string({
      char: 'a',
      description: 'Amount (atto)',
      required: false
    }),
    tokenAmounts: Flags.string({
      char: 't',
      description: 'Token amounts, in the format of `tokenId:tokenAmount',
      required: false,
      multiple: true
    })
  }

  async execute(): Promise<void> {
    const { args, flags } = await this.parse(CallTxScript)
    const projectRootDir = path.resolve(flags.projectRootDir || '.')
    try {
      const nodeUrl = await this.getNodeUrl(flags)
      const nodeProvider = new NodeProvider(nodeUrl)
      web3.setCurrentNodeProvider(nodeProvider)
      const signer = await this.getSigner()
      await loadProject(projectRootDir)
      const parsedScriptMethodCall = parseScriptMethodCall(args.methodCall)
      const script = Project.script(parsedScriptMethodCall.scriptName)
      if (parsedScriptMethodCall.args.length != script.fieldsSig.names.length) {
        throw new Error(`Invalid number of arguments. Expected ${script.fieldsSig.names.length}, got ${parsedScriptMethodCall.args.length}`)
      }

      const initialFields: NamedVals = {}
      for (let i = 0; i < parsedScriptMethodCall.args.length; i++) {
        if (script.fieldsSig.types[i] != parsedScriptMethodCall.args[i].type) {
          throw new Error(`Invalid type for argument ${i} ${script.fieldsSig.names[i]}. Expected ${script.fieldsSig.types[i]}, got ${parsedScriptMethodCall.args[i].type}`)
        }
        const fieldName = script.fieldsSig.names[i]
        const argType = parsedScriptMethodCall.args[i].type
        const stringTypes = ['Address', 'ByteVec']
        const bigIntTypes = ['I256', 'U256']
        if (stringTypes.includes(argType)) {
          initialFields[fieldName] = parsedScriptMethodCall.args[i].value as string
        }
        if (bigIntTypes.includes(argType)) {
          initialFields[fieldName] = BigInt(parsedScriptMethodCall.args[i].value as string)
        }
        if (parsedScriptMethodCall.args[i].type === 'Bool') {
          initialFields[fieldName] = Boolean(parsedScriptMethodCall.args[i].value)
        }
        if (parsedScriptMethodCall.args[i].type === 'Array') {
          throw new Error(`Array type not supported yet`)
        }
      }

      const tokens = flags.tokenAmounts && parseTokens(flags.tokenAmounts)
      const signerParams = await script.txParamsForExecution(signer, {
        initialFields: initialFields,
        attoAlphAmount: flags.alphAmount || DUST_AMOUNT,
        tokens
      })

      ux.action.start(`Executing script ${parsedScriptMethodCall.scriptName}`, undefined, { stdout: true })
      const result = await signer.signAndSubmitExecuteScriptTx(signerParams)
      ux.action.start('Waiting for tx confirmation', undefined, { stdout: true })
      await waitTxConfirmed(nodeProvider, result.txId)
      ux.action.stop('Done')
      this.log(JSON.stringify(result, null, 2))
    } catch (e) {
      console.error(e)
    }
  }
}
