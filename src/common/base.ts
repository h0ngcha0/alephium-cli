import { Command as BaseCommand, Flags } from '@oclif/core'

export abstract class Command extends BaseCommand {
  static flags = {
    nodeUrl: Flags.string({
      char: 'n',
      description: 'Node URL',
      required: false,
      env: "ALEPHIUM_NODE_URL",
      default: 'http://127.0.0.1:22973',
    }),
  }

  async printApiResponse<T>(response: Promise<T>): Promise<void> {
    await response
      .then(obj => {
        this.log(JSON.stringify(obj, null, 2))
      })
      .catch(error => {
        console.error(error)
      })
  }
}
