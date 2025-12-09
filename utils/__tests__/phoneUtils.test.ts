import { maskPhoneNumber } from '../phoneUtils';

describe('maskPhoneNumber', () => {
    it('should mask phone number when user is not logged in', () => {
        expect(maskPhoneNumber('1234567890', false)).toBe('******7890');
    });

    it('should show full phone number when user is logged in', () => {
        expect(maskPhoneNumber('1234567890', true)).toBe('1234567890');
    });

    it('should handle empty or null input', () => {
        expect(maskPhoneNumber('', false)).toBe('');
        expect(maskPhoneNumber(null as any, false)).toBe('');
    });
});
