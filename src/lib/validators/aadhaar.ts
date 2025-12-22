// Aadhaar Validation with Verhoeff Checksum Algorithm
// Reference: UIDAI Aadhaar Number validation specification

// Verhoeff multiplication table
const d: number[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

// Verhoeff permutation table
const p: number[][] = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

/**
 * Validates Aadhaar number using Verhoeff checksum algorithm
 * @param aadhaar - 12-digit Aadhaar number (can include spaces)
 * @returns boolean - true if valid, false otherwise
 */
export function validateAadhaar(aadhaar: string): boolean {
    // Remove spaces and hyphens
    const cleanAadhaar = aadhaar.replace(/[\s-]/g, '');

    // Basic format check: 12 digits, first digit must be 2-9
    if (!/^[2-9]\d{11}$/.test(cleanAadhaar)) {
        return false;
    }

    // Verhoeff checksum validation
    let c = 0;
    const digits = cleanAadhaar.split('').reverse();

    for (let i = 0; i < digits.length; i++) {
        c = d[c][p[i % 8][parseInt(digits[i])]];
    }

    return c === 0;
}

/**
 * Formats Aadhaar number as XXXX XXXX XXXX
 * @param aadhaar - Raw Aadhaar number
 * @returns Formatted Aadhaar string
 */
export function formatAadhaar(aadhaar: string): string {
    const clean = aadhaar.replace(/[\s-]/g, '');
    if (clean.length !== 12) return aadhaar;
    return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`;
}

/**
 * Masks Aadhaar number for display (XXXX XXXX 1234)
 * @param aadhaar - Full Aadhaar number
 * @returns Masked Aadhaar string
 */
export function maskAadhaar(aadhaar: string): string {
    const clean = aadhaar.replace(/[\s-]/g, '');
    if (clean.length !== 12) return aadhaar;
    return `XXXX XXXX ${clean.slice(-4)}`;
}

/**
 * Generates a valid random Aadhaar number for testing
 * Uses Verhoeff algorithm to generate valid checksum
 * @returns A valid 12-digit Aadhaar number
 */
export function generateTestAadhaar(): string {
    // Generate 11 random digits (first digit 2-9)
    const firstDigit = Math.floor(Math.random() * 8) + 2;
    const digits = [firstDigit];

    for (let i = 0; i < 10; i++) {
        digits.push(Math.floor(Math.random() * 10));
    }

    // Calculate Verhoeff checksum
    let c = 0;
    const reversed = [...digits].reverse();

    for (let i = 0; i < reversed.length; i++) {
        c = d[c][p[(i + 1) % 8][reversed[i]]];
    }

    // Find check digit
    const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];
    const checkDigit = inv[c];

    digits.push(checkDigit);
    return digits.join('');
}

// Pattern for basic format validation
export const AADHAAR_PATTERN = /^[2-9]\d{11}$/;

// Pattern for formatted Aadhaar (with spaces)
export const AADHAAR_FORMATTED_PATTERN = /^[2-9]\d{3}\s?\d{4}\s?\d{4}$/;
