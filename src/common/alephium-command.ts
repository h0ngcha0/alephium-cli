import { Command, Flags } from '@oclif/core'

export abstract class AlephiumCommand extends Command {
  static nodeUrlFlag = Flags.string({
    char: 'n',
    description: 'Node URL',
    required: false,
    default: 'http://127.0.0.1:22973',
  })

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
