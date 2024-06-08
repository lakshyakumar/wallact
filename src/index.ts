import { ethers } from "ethers";

// Define the Wallact class to interact with smart contracts
export class Wallact {
    // A collection to hold instances of ethers.Contract keyed by entity names
    private contractCollection: { [key: string]: ethers.Contract } = {};
    // The smart contract's address on the blockchain
    private contractAddress: string;
    // The smart contract's ABI (Application Binary Interface)
    private contractABI: any;
    // The blockchain's RPC (Remote Procedure Call) URL
    private blockchainRpc: string;

    // Constructor to initialize the Wallact instance
    constructor(blockchainRpc: string, contractAddress: string, contractABI: any, defaultEntityKey?: string) {
        this.blockchainRpc = blockchainRpc;
        this.contractAddress = contractAddress;
        this.contractABI = contractABI;
        // If a defaultEntityKey is provided, create a defaultContract with it
        if (defaultEntityKey) {
            let defaultWallet = new ethers.Wallet(defaultEntityKey, new ethers.JsonRpcProvider(this.blockchainRpc));
            this.contractCollection["defaultContract"] = new ethers.Contract(contractAddress, contractABI, defaultWallet);
        }
        // Always create a readContract for read-only interactions
        this.contractCollection["readContract"] = new ethers.Contract(contractAddress, contractABI, new ethers.JsonRpcProvider(this.blockchainRpc));
    }

    // Static method to convert an amount to Wei (the smallest unit of Ether)
    static convertToWei(amount: number | string) {
        try {
            let inWei = ethers.parseEther(amount.toString());
            return inWei;
        } catch (e: any) {
            throw new Error("Error converting to Wei" + e.message)
        }
    }

    // Static method to convert an amount from Wei to Ether
    static convertToEth(amount: number | string) {
        try {
            let inEth = ethers.formatEther(amount.toString());
            return inEth;
        } catch (e: any) {
            throw new Error("Error converting to Eth" + e.message)
        }
    }

    // Add a new entity wallet to the contractCollection
    addEntityWallet(entity: string, entityKey: string) {
        try {
            let wallet = new ethers.Wallet(entityKey, new ethers.JsonRpcProvider(this.blockchainRpc));
            this.contractCollection[entity] = new ethers.Contract(this.contractAddress, this.contractABI, wallet);
        } catch (e: any) {
            throw new Error("Error adding entity wallet" + e.message);
        }
    }

    // Read data from the smart contract
    async readContract(methodName: string, data: any[]) {
        try {
            // Use the readContract instance for read operations
            let result = await this.contractCollection["readContract"].getFunction(methodName)(...data);
            return result;
        } catch (e: any) {
            throw new Error("Error reading from the contract" + e.message);
        }
    }

    // Write data to the smart contract
    async writeContract(methodName: string, data: any[], entity?: string) {
        let contract: ethers.Contract;
        // Determine which contract instance to use for the write operation
        if (entity && this.contractCollection[entity]) {
            contract = this.contractCollection[entity];
        } else if (this.contractCollection["defaultContract"]) {
            contract = this.contractCollection["defaultContract"];
        } else {
            throw new Error("No entity provided and no default wallet set");
        }
        try {
            // Execute the specified method on the contract
            let result = contract.getFunction(methodName)(...data);
            return result;
        } catch (e: any) {
            throw new Error("Error writing to the contract" + e.message);
        }
    }
}