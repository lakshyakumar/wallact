# Wallact

This TypeScript library provides a simplified interface for interacting with smart contracts on the Ethereum blockchain. It abstracts the complexities of read and write operations, making it easier for developers to work with smart contracts within their applications.

## Features

- **Simplified Contract Interaction**: Offers easy-to-use methods for reading from and writing to smart contracts.
- **Flexible Contract Management**: Supports multiple contract instances, allowing interactions with various entities and contracts through a single interface.
- **Error Handling**: Implements try-catch blocks for robust error handling during contract interactions.

## Getting Started

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (v6 or higher recommended)
- An Ethereum wallet with some ETH for transactions
- Access to an Ethereum node (via services like Infura or Alchemy)

### Installation

1. Install with npm:

```bash
npm i wallact
```

### Usage

#### Reading from a Smart Contract

To read data from a smart contract, use the `readContract` method. This method requires the name of the contract method you wish to call and an array of arguments for that method.

```typescript
import { Wallact } from "./path/to/library";

async function readData() {
  const contractInterface = new Wallact(
    "https://rpc-url/",
    "0xContractddress",
    contractAbi
  );
  try {
    const data = await contractInterface.readContract("methodName", [
      "arg1",
      "arg2",
    ]);
    console.log("Contract data:", data);
  } catch (error) {
    console.error("Error reading from contract:", error);
  }
}
```

#### Writing to a Smart Contract

To write data to a smart contract, use the `writeContract` method. This method requires the name of the contract method you wish to call, an array of arguments for that method, and optionally the entity (contract instance) to use for the write operation.

```typescript
import { Wallact } from "wallact";

async function writeData() {
  const contractInterface = new Wallact(
    "https://rpc-url/",
    "0xContractddress",
    contractAbi,
    "0xYourPrivateKey"
  );
  try {
    const receipt = await contractInterface.writeContract("methodName", [
      "arg1",
      "arg2",
    ]);
    console.log("Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error writing to contract:", error);
  }
}
```

#### Writing to a Smart Contract with multiple entities

To write data to a smart contract with different entity, use the `addEntityWallet` method. This method requires the name of the entity and key for that entity.

```typescript
import { Wallact } from "wallact";

async function writeData() {
  const contractInterface = new Wallact(
    "https://rpc-url/",
    "0xContractddress",
    contractAbi,
    "0xYourPrivateKey",
    "ownerEntity"
  );

  contractInterface.addEntityWallet("verifier", "0xVerifierPrivateKey");

  try {
    const receipt = await contractInterface.writeContract(
      "methodName",
      ["arg1", "arg2"],
      "verifier"
    );
    console.log("Transaction receipt:", receipt);
  } catch (error) {
    console.error("Error writing to contract:", error);
  }
}
```

#### Converting Ether to Wei

To convert Ether to Wei, which is necessary for many contract interactions requiring value transactions, use the `convertToWei` static method. This method takes the amount in Ether as an argument and returns its equivalent in Wei.

```typescript
import { Wallact } from "wallact";

const etherAmount = 1; // Example amount in Ether
const weiAmount = Wallact.convertToWei(etherAmount);
console.log(`${etherAmount} Ether is equivalent to ${weiAmount} Wei.`);
```

#### Converting Wei to Ether

Conversely, to convert Wei back to Ether, perhaps for displaying balances in a more readable format, use the `convertToEth` static method. This method takes the amount in Wei as an argument and returns its equivalent in Ether.

```typescript
import { Wallact } from "wallact";

const weiAmount = BigInt("1000000000000000000"); // Example amount in Wei
const etherAmount = Wallact.convertToEth(weiAmount.toString());
console.log(`${weiAmount} Wei is equivalent to ${etherAmount} Ether.`);
```

## Contributing

Contributions are welcome! Please feel free to submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
