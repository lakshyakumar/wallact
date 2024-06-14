// Import the Wallact class to test its static utility functions
import { Wallact } from "../src";

// Describe a test suite focused on validating Ethereum addresses
describe('Ethereum Address Validation', () => {
    // Test case for validating an Ethereum address
    it('should validate a correct Ethereum address', () => {
        const result = Wallact.isValidEthereumAddress("0x49A6F7Ece315a56C097c4Fc72F5aA2886B9c260a");
        expect(result).toBe(true);
    });
});