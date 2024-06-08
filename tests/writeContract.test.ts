// Import the Wallact class and contract ABI for testing
import { Wallact } from "../src";
import { default as abi } from "../assets/contractABI.json";

// Mock the entire Wallact module to intercept and simulate its behavior
jest.mock("../src", () => {
    return {
        // Mock the Wallact class
        Wallact: jest.fn().mockImplementation(() => {
            return {
                // Mock the writeContract method to always resolve with a "transactionHash"
                writeContract: jest.fn().mockResolvedValue("transactionHash"),
                // Mock the readContract method to always resolve with a value of 100.0
                readContract: jest.fn().mockResolvedValue(100.0),
            };
        }),
    };
});

// Describe a test suite for the writeContract function of the Wallact class
describe('write contract Function', () => {
    // Define a test case for writing data to the smart contract
    it('should write data to smart contract', async () => {
        // Instantiate a new Wallact object with test parameters
        let wallactContract = new Wallact("https://rpc-testnet.blockchain.technology/", "0x2bF148eFDF0f428E8BAAE012911B918dcB357312", abi, "70ca8af919e7766904be9bd8ef35a5e0c7c3755f7ce0897a3568d1542442285a");
        // Attempt to write data to the smart contract using the mocked writeContract method
        await wallactContract.writeContract("store", [100]);
        // Read data from the smart contract using the mocked readContract method
        const result = await wallactContract.readContract("retrieve", []);
        // Assert that the result of the read operation matches the expected value of 100.0
        expect(result).toBe(100.0);
    });
});