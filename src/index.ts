import { ethers } from "ethers";
import { default as abi } from "../assets/contractABI.json";

// Define the Wallact class to interact with smart contracts
export class Wallact {
    // A collection to hold instances of ethers.Contract keyed by entity names
    private contractCollection: { [key: string]: ethers.Contract } = {};
    // A collection to hold instances of ethers.Wallet keyed by entity names
    private walletCollection : {[key: string]: ethers.Wallet} = {};
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
            this.walletCollection["defaultWallet"] = defaultWallet;
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

    static createWallet(userId: string, SHARD = "anyShard"): { privateKey: string; address: string } {
        // Use the shard and userId to create a unique, deterministic seed
        // Note: In a real application, ensure the seed generation strategy is secure
        const seedPhrase = `${SHARD}-${userId}`;
        const seed = ethers.id(seedPhrase);

        // Generate a mnemonic from the seed. Note: This is a simplified example.
        // In practice, you should use a more secure method for generating a mnemonic.
        const mnemonic = ethers.Mnemonic.fromEntropy(ethers.getBytes(seed));

        // For example, "m/44'/60'/0'/0/0" is a common path for Ethereum wallets.
        const walletPath = "44'/60'/0'/0/0";

        // Create an HDNode from the mnemonic
        const hdNode = ethers.HDNodeWallet.fromMnemonic(mnemonic);

        // Derive a path. The path can be adjusted to generate multiple addresses from the same seed.

        const wallet = hdNode.derivePath(walletPath);

        return {
            privateKey: wallet.privateKey,
            address: wallet.address,
        };
    }

    // Add a new entity wallet to the contractCollection
    addEntityWallet(entity: string, entityKey: string) {
        try {
            let wallet = new ethers.Wallet(entityKey, new ethers.JsonRpcProvider(this.blockchainRpc));
            this.contractCollection[entity] = new ethers.Contract(this.contractAddress, this.contractABI, wallet);
            this.walletCollection[entity] = wallet;
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

    async signMessage(message: string, entity?: string){
        let wallet: ethers.Wallet;
        // Determine which wallet instance to use for signing message
        if (entity && this.walletCollection[entity]) {
            wallet = this.walletCollection[entity];
        } else if (this.walletCollection["defaultWallet"]) {
            wallet = this.walletCollection["defaultWallet"];
        } else {
            throw new Error("No entity provided and no default wallet set");
        }
        try{
           const result = await wallet.signMessage(message);
           return result;
        }catch (e: any) {
            throw new Error("Error Signing message" + e.message);
        }
    }
}
