/**
 * Validation utility functions
 */

export interface PhoneValidation {
    valid: boolean;
    error?: string;
}

export interface PasswordValidation {
    valid: boolean;
    error?: string;
}

/**
 * Validates password strength
 * @param password - Password to validate
 * @returns Validation result with error message if invalid
 */
export function validatePassword(password: string): PasswordValidation {
    if (!password) {
        return { valid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return { valid: false, error: 'Password must be at least 8 characters long' };
    }

    if (!/[A-Z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one uppercase letter' };
    }

    if (!/[a-z]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one lowercase letter' };
    }

    if (!/[0-9]/.test(password)) {
        return { valid: false, error: 'Password must contain at least one number' };
    }

    return { valid: true };
}

/**
 * Validates phone number format
 * @param phone - Phone number to validate
 * @returns Validation result with error message if invalid
 */
export function validatePhoneNumber(phone: string): PhoneValidation {
    if (!phone) {
        return { valid: false, error: 'Phone number is required' };
    }

    // Remove all non-digit characters
    const digitsOnly = phone.replace(/\D/g, '');

    // Phone number should have 10-15 digits
    if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        return { valid: false, error: 'Phone number must be 10-15 digits' };
    }

    return { valid: true };
}

/**
 * Formats phone number for consistent storage
 * @param phone - Phone number to format
 * @returns Formatted phone number with country code
 */
export function formatPhoneNumber(phone: string): string {
    const digitsOnly = phone.replace(/\D/g, '');

    // If starts with country code, keep it
    if (phone.trim().startsWith('+')) {
        return '+' + digitsOnly;
    }

    // If 10 digits (Indian number without code), add +91
    if (digitsOnly.length === 10) {
        return '+91' + digitsOnly;
    }

    // Otherwise return with + prefix
    return '+' + digitsOnly;
}

/**
 * Validates email format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
