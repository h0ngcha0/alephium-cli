import { node, addressFromContractId, isBase58, isHexString, NodeProvider, groupOfAddress } from '@alephium/web3'
import { Val } from '@alephium/web3/dist/src/api/api-alephium'
import { CallContractSucceeded } from '@alephium/web3/dist/src/api/api-alephium'

// const requestInterval = networkId === 'devnet' ? 1000 : 10000
export async function waitTxConfirmed(
  provider: NodeProvider,
  txId: string,
): Promise<node.Confirmed> {
  const status = await provider.transactions.getTransactionsStatus({ txId: txId })
  if (isConfirmed(status) && status.chainConfirmations >= 1) {
    return status
  }
  await new Promise((r) => setTimeout(r, 5000))
  return waitTxConfirmed(provider, txId)
}

function isConfirmed(txStatus: node.TxStatus): txStatus is node.Confirmed {
  return txStatus.type === 'Confirmed'
}

export function tryGetContractAddress(idOrAddress: string): string {
  if (isContractId(idOrAddress)) {
    return addressFromContractId(idOrAddress)
  }
  if (isBase58(idOrAddress)) {
    return idOrAddress
  }
  throw new Error(`Invalid contract id or contract address: ${idOrAddress}`)
}

export function isContractId(str: string) {
  return str.length === 64 && isHexString(str)
}

export function inferArgType(str: string) {
  // Bool
  const booleans = ['true', 'false']
  if (booleans.includes(str.toLowerCase())) {
    return 'Bool'
  }

  // Address
  try {
    groupOfAddress(str)
    return 'Address'
  } catch (e) {
    // ignore
  }

  // I256, U256
  try {
    const num = Number(str)
    if (Number.isInteger(num)) {
      if (num >= 0) {
        return 'U256'
      } else {
        return 'I256'
      }
    }
  } catch (e) {
    // ignore
  }

  // Array
  // TODO: This needs to be fixed
  const isArray = str.trim().startsWith('[') && str.trim().endsWith(']')
  if (isArray) {
    return 'Array'
  }

  // Otherwise, ByteVec
  return 'ByteVec'
}

const methodCallRegex = /(\w*)\.(\w*)\(([^)]*)\)/;
export interface ParsedMethodCall {
  contractName: string,
  methodName: string,
  args: Val[]
}

export function parseMethodCall(methodCall: string): ParsedMethodCall {
  const matches = methodCallRegex.exec(methodCall)
  if (matches) {
    const contractName = matches[1].trim();
    const methodName = matches[2].trim();
    let args = undefined
    try {
      const methodArgs = matches[3].split(',').map(arg => arg.trim());
      args = methodArgs.map((args) => {
        const splitted = args.split(':')
        if (splitted[1]) {
          return { type: splitted[1], value: splitted[0] }
        } else {
          return { type: inferArgType(splitted[0]), value: splitted[0] }
        }
      })
    } catch (e) {
      throw new Error(`Method Args ${matches[3]} are not formatted correctly: ${e}`)
    }

    return { contractName, methodName, args }
  } else {
    throw new Error(`${methodCall} is not formatted correctly`)
  }
}

export async function callMethod(
  nodeProvider: NodeProvider,
  address: string,
  group: number,
  methodIndex: number,
  args: Val[]
) {
  const result = await nodeProvider.contracts.postContractsCallContract({ address, group, methodIndex, args: args })
  if (result.type === 'CallContractSucceeded') {
    const successfulReturns = (result as CallContractSucceeded).returns
    if (successfulReturns.length === 0) {
      console.log('No return value')
    } else if (successfulReturns.length === 1) {
      console.log(successfulReturns[0].value)
    } else {
      console.log((result as CallContractSucceeded).returns.map((r) => r.value))
    }

  } else if (result.type === 'CallContractFailed') {
    console.error(result)
  }

}