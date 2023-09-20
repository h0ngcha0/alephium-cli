import { NetworkId, SignerProvider, } from '@alephium/web3'
import { NodeWallet, PrivateKeyWallet } from '@alephium/web3-wallet'
import { Command as BaseCommand, Flags } from '@oclif/core'
import fs from 'fs-extra'
import path from 'path'
import { testPassword, testAddress, testWalletName } from '@alephium/web3-test'

type SignerProviderConfig =
  | {
    type: 'NodeWallet',
    name: string,
    password: string
  }
  | {
    type: 'PrivateKeyWallet',
    privateKey: string
  }

export abstract class Command extends BaseCommand {
  networkToNodeUrl = {
    'devnet': 'http://127.0.0.1:22973',
    'testnet': 'https://alephium-testnet.alephium.org',
    'mainnet': 'https://wallet-v20.mainnet.alephium.org'
  }

  static flags = {
    network: Flags.string({
      char: 'n',
      description: 'Network',
      required: false,
      env: "ALEPHIUM_NETWORK",
      default: 'devnet',
    }),
    nodeUrl: Flags.string({
      char: 'u',
      description: 'Node URL',
      required: false,
      env: "ALEPHIUM_NODE_URL"
    })
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

  async getSigner(): Promise<SignerProvider> {
    const userConfig = await this.getUserConfig()
    switch (userConfig.type) {
      case 'NodeWallet': {
        // NOTE: web3.setCurrentNodeProvider should be called at this point
        const wallet = new NodeWallet(userConfig.name)
        await wallet.unlock(userConfig.password)
        return wallet
      }

      case 'PrivateKeyWallet': {
        return new PrivateKeyWallet({ privateKey: userConfig.privateKey })
      }
    }
  }

  async getSignerAddress(): Promise<string> {
    const signer = await this.getSigner()
    return (await signer.getSelectedAccount()).address
  }

  async getUserConfig(): Promise<SignerProviderConfig> {
    const configFile = path.join(this.config.configDir, 'config.json')
    try {
      return await fs.readJSON(configFile) as SignerProviderConfig
    } catch (e) {
      return Promise.resolve({
        "type": "NodeWallet",
        "name": testWalletName,
        "address": testAddress,
        "password": testPassword
      })
    }
  }

  async getNodeUrl(flags: any): Promise<string> {
    const network: NetworkId = flags.network as NetworkId
    return flags.nodeUrl || this.networkToNodeUrl[network]
  }

  async run(): Promise<void> {
    try {
      return await this.execute()
    } catch (e) {
      console.log("Error executing command", e)
    }
  }

  abstract execute(): Promise<void>
}
