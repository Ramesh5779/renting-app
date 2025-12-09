/**
 * Phone number utility functions for sanitization and formatting
 */

/**
 * Sanitizes phone number by removing all non-digit characters except leading +
 * @param phone - Raw phone number (e.g., "+91 98765 43210" or "98765-43210")
 * @returns Sanitized phone number (e.g., "+919876543210" or "9876543210")
 */
export function sanitizePhoneNumber(phone: string): string {
    if (!phone) return '';

    // Remove all non-digit characters except +, keep only first +
    const cleaned = phone.replace(/[^\d+]/g, '');

    // Ensure only one + at the beginning
    const parts = cleaned.split('+');
    if (parts.length > 1) {
        return '+' + parts.filter(p => p).join('');
    }

    return cleaned;
}

/**
 * Validates if phone number is valid for WhatsApp
 * @param phone - Phone number to validate
 * @returns True if valid for WhatsApp (10-15 digits, optional country code)
 */
export function isValidWhatsAppNumber(phone: string): boolean {
    const sanitized = sanitizePhoneNumber(phone);
    return /^\+?\d{10,15}$/.test(sanitized);
}

/**
 * Formats phone number for display with country code
 * @param phone - Raw phone number
 * @returns Formatted phone number for display
 */
export function formatPhoneForDisplay(phone: string): string {
    const sanitized = sanitizePhoneNumber(phone);

    // If starts with +91 (India), format as +91 XXXXX XXXXX
    if (sanitized.startsWith('+91') && sanitized.length === 13) {
        return `+91 ${sanitized.slice(3, 8)} ${sanitized.slice(8)}`;
    }

    // If starts with +1 (US/Canada), format as +1 (XXX) XXX-XXXX
    if (sanitized.startsWith('+1') && sanitized.length === 12) {
        return `+1 (${sanitized.slice(2, 5)}) ${sanitized.slice(5, 8)}-${sanitized.slice(8)}`;
    }

    // Default: return as-is
    return sanitized;
}

/**
 * Masks phone number for privacy (shows only last 4 digits)
 * @param phone - Phone number to mask
 * @param showFull - If true, shows full number; if false, masks it
 * @returns Masked or full phone number
 */
export function maskPhoneNumber(phone: string, showFull: boolean = false): string {
    if (showFull) {
        return formatPhoneForDisplay(phone);
    }

    const sanitized = sanitizePhoneNumber(phone);
    if (!sanitized) return '';
    if (sanitized.length <= 4) return '****';

    const lastFour = sanitized.slice(-4);
    const masked = '*'.repeat(sanitized.length - 4);

    return `${masked}${lastFour}`;
}
