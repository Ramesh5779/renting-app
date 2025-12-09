
import { Alert } from 'react-native';

import { logger } from './logger';

export class AppError extends Error {
    constructor(message: string, public originalError?: any) {
        super(message);
        this.name = 'AppError';
    }
}

export const parseError = (error: any): AppError => {
    logger.error('Parsing error:', error);
    let message = 'An unexpected error occurred. Please try again.';

    if (!error) {
        return new AppError(message, error);
    }

    // Network / Connection Errors
    if (
        error.message?.includes('Network request failed') ||
        error.message?.includes('connection') ||
        error.message?.includes('fetch') ||
        error.status === 0
    ) {
        message = 'No internet connection. Please check your network settings.';
        return new AppError(message, error);
    }

    // Auth Errors
    const errorString = typeof error === 'string' ? error : error?.message || JSON.stringify(error);
    if (errorString && (errorString.includes('User already registered') || errorString.includes('already registered'))) {
        message = 'This email is already registered. Please sign in instead.';
        return new AppError(message, error);
    }

    if (errorString && (errorString.includes('Invalid login credentials') || errorString.includes('invalid_grant'))) {
        message = 'Invalid email or password. Please check your credentials.';
        return new AppError(message, error);
    }

    // Supabase / Database Errors
    if (error.code) {
        switch (error.code) {
            case '23505': // Unique violation
                message = 'This record already exists.';
                break;
            case '23503': // Foreign key violation
                message = 'Operation failed due to related data constraints.';
                break;
            case '42P01': // Undefined table
                message = 'System error: Database configuration issue.';
                break;
            case 'PGRST116': // Row not found (often handled separately, but good fallback)
                message = 'The requested data could not be found.';
                break;
            case '42501': // RLS violation
                message = 'You do not have permission to perform this action.';
                break;
            default:
                message = error.message || message;
        }
    } else if (error.message) {
        message = error.message;
    }

    return new AppError(message, error);
};

export const showErrorAlert = (error: any, title: string = 'Error') => {
    const parsed = parseError(error);
    Alert.alert(title, parsed.message);
};
