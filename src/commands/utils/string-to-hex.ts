import * as web3 from '@alephium/web3'
import { Args, Command } from '@oclif/core'

export default class StringToHex extends Command {
  static description = 'Convert string to hex'
  static examples = [
    '$ alephium-cli utils string-to-hex ',
  ]

  static args = {
    str: Args.string({
      description: 'String to be converted to hex',
      required: true
    })
  }

  async run(): Promise<void> {
    const { args } = await this.parse(StringToHex)
    this.log(web3.stringToHex(args.str))
  }
}
