// Import the Wallact class from the src directory to test its functionality
import { Wallact } from "../src";
// Import the ABI for the contract from a JSON file in the assets directory
import { default as abi } from "../assets/contractABI.json";

// Describe a test suite for read functions of the Wallact class
describe('Read Functions', () => {
    // Define a test case for reading data from the contract
    it('should read from contract', async () => {
        // Instantiate a readOnlyContract with the RPC URL, contract address, and ABI
        let readOnlyContract = new Wallact("https://rpc-amoy.polygon.technology/", "0x2bF148eFDF0f428E8BAAE012911B918dcB357312", abi);
        // Call the readContract method with the method name "message" and no parameters
        const result = await readOnlyContract.readContract("message", []);
        // Assert that the result of the read operation is 'Hello World!'
        expect(result).toBe('Hello World!');
    });
});