Alephium CLI
=================

<!-- toc -->
* [Usage](#usage)
* [Config](#config)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @h0ngcha0/alephium-cli
$ alephium-cli COMMAND
running command...
$ alephium-cli (--version)
@h0ngcha0/alephium-cli/0.3.1 linux-x64 node-v16.20.0
$ alephium-cli --help [COMMAND]
USAGE
  $ alephium-cli COMMAND
...
```
<!-- usagestop -->

# Config

## Signer
Signer provider can be configured using the config file located at
`~/.config/alephium-cli/config.json`. Examples:
`

### Node Wallet
```
{
  "type": "NodeWallet",
  "name": "alephium-web3-test-only-wallet",
  "password": "alph"
}
```
This is the default signer provider if no config file is provided.

### PrivateKeyWallet
```
{
  "type": "PrivateKeyWallet",
  "mnemonic": "vault alarm sad mass witness property virus style good flower rice alpha viable evidence run glare pretty scout evil judge enroll refuse another lava"
}
```

## Network

Network is defaulted to `devnet`, you can update the network by
setting the `ALEPHIUM_NETWORK` environment variable.

e.g.

```
export ALEPHIUM_NETWORK=testnet
```
