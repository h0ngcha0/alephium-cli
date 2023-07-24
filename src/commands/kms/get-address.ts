import { GcpKmsSigner, GcpKmsSignerCredentials } from "ethers-gcp-kms-signer";
import * as web3 from '@alephium/web3'
import { Flags } from '@oclif/core'
import { Command } from '@oclif/core'
import { flags } from "@oclif/core/lib/parser";

export default class GetPublicKey extends Command {
  static description = 'Convert contract id to address'
  static examples = [
    '$ alephium-cli kms get-public-key -p project -r keyring -k key -l global',
  ]

  static flags = {
    ...Command.flags,
    project: Flags.string({
      char: 'p',
      description: 'Project',
      required: true
    }),
    keyRing: Flags.string({
      char: 'r',
      description: 'KeyRing',
      required: true
    }),
    key: Flags.string({
      char: 'k',
      description: 'Key',
      required: true
    }),
    location: Flags.string({
      char: 'l',
      description: 'Location',
      required: true,
      default: "global"
    }),
    version: Flags.string({
      char: 'v',
      description: 'Version',
      required: true,
      default: "1"
    })
  }

  async run(): Promise<void> {
    const { flags } = await this.parse(GetPublicKey)
    const kmsCredentials: GcpKmsSignerCredentials = {
      projectId: flags.project,
      locationId: flags.location,
      keyRingId: flags.keyRing,
      keyId: flags.key,
      keyVersion: flags.version,
    };
    let signer = new GcpKmsSigner(kmsCredentials);
    const address = await signer.getAddress()
    console.log(address)
  }
}
