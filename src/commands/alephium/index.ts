import { Command, Flags } from '@oclif/core'

export default class Alephium extends Command {
  static description = 'Collection of Alephium Utils'

  async run(): Promise<void> {
    this.log(Alephium.help)
  }
}
