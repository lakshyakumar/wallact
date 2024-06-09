// Import the Wallact class to test its static utility functions
import { Wallact } from "../src";

// Describe a test suite focused on generating keys for a user
describe('Should be generating key for a user', () => {
    // Test case for creating a key and address for a user
    it('should create key and address', () => {
        // Use the Wallact class's static method createWallet to generate a wallet for a user
        const result = Wallact.createWallet("userid-1");
        // Assert that the generated address matches the expected value
        expect(result.address).toBe("0x49A6F7Ece315a56C097c4Fc72F5aA2886B9c260a");
    });
});