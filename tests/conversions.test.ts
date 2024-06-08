// Import the Wallact class to test its static utility functions
import { Wallact } from "../src";

// Describe a test suite focused on testing the conversion between Ethereum's Ether and Wei units
describe('Should be converting between Eth and Wei', () => {
    // Test case for converting Ether to Wei
    it('should convert eth to wei', () => {
        // Use the Wallact class's static method convertToWei to convert 1 Ether to Wei
        const result = Wallact.convertToWei(1);
        // Assert that the conversion result matches the expected value of 1 Ether in Wei
        expect(result.toString()).toBe(BigInt('1000000000000000000').toString());
    });
    // Test case for converting Wei to Ether
    it('should convert wei to eth', () => {
        // Use the Wallact class's static method convertToEth to convert 1000000000000000000 Wei to Ether
        const result = Wallact.convertToEth("1000000000000000000");
        // Assert that the conversion result matches the expected value of 1.0 Ether
        expect(result.toString()).toBe("1.0");
    });
});