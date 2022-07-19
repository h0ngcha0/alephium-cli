import * as web3 from '@alephium/web3'
import { AlephiumCommand } from '../../alephium-command'

export default class IdFromAddress extends AlephiumCommand {
  static description = 'Convert address from contract id'
  static examples = [
    `$ alephium contract id-from-from VD81DKvST27PVY1YM5tkZeEAEXjQG3gYfwDEN5M7F6ggK57JZqfBx8ow1xhtRR4y2s`,
  ]

  static args = [{ name: 'address', description: 'ContractId', required: true }]

  async run(): Promise<void> {
    const { args } = await this.parse(IdFromAddress)
    this.log(web3.binToHex(web3.contractIdFromAddress(args.address)))
  }
}
