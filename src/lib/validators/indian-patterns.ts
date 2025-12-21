// Indian-specific validation patterns and utilities

/**
 * Indian Mobile Number Pattern
 * - 10 digits
 * - Starts with 6, 7, 8, or 9
 */
export const MOBILE_PATTERN = /^[6-9]\d{9}$/;

/**
 * Indian Mobile with country code
 * - +91 followed by 10 digits
 */
export const MOBILE_WITH_CODE_PATTERN = /^\+91[6-9]\d{9}$/;

/**
 * Indian PIN Code Pattern
 * - 6 digits
 * - First digit cannot be 0
 */
export const PINCODE_PATTERN = /^[1-9]\d{5}$/;

/**
 * IFSC Code Pattern
 * - First 4 characters: Bank code (letters)
 * - 5th character: Always 0 (reserved for future use)
 * - Last 6 characters: Branch code (alphanumeric)
 */
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;

/**
 * Virtual ID (VID) Pattern
 * - 16 digits (alternative to Aadhaar for authentication)
 */
export const VID_PATTERN = /^\d{16}$/;

/**
 * CKYC Number Pattern
 * - 14 digits (KYC Identifier Number from CKYC Registry)
 */
export const CKYC_PATTERN = /^\d{14}$/;

/**
 * GST Number Pattern
 * - 15 characters
 * - First 2: State code
 * - Next 10: PAN
 * - 13th: Entity number
 * - 14th: Z (default)
 * - 15th: Check digit
 */
export const GST_PATTERN = /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/**
 * Indian Bank Account Number Pattern
 * - 9 to 18 digits (varies by bank)
 */
export const ACCOUNT_NUMBER_PATTERN = /^\d{9,18}$/;

/**
 * Indian Vehicle Registration Number Pattern
 * - Format: XX 00 XX 0000
 */
export const VEHICLE_PATTERN = /^[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}$/;

// Validation Functions

export function validateMobile(mobile: string): boolean {
    const clean = mobile.replace(/[\s-]/g, '');
    return MOBILE_PATTERN.test(clean);
}

export function validateMobileWithCode(mobile: string): boolean {
    const clean = mobile.replace(/[\s-]/g, '');
    return MOBILE_WITH_CODE_PATTERN.test(clean);
}

export function validatePincode(pincode: string): boolean {
    return PINCODE_PATTERN.test(pincode.trim());
}

export function validateIFSC(ifsc: string): boolean {
    return IFSC_PATTERN.test(ifsc.toUpperCase().trim());
}

export function validateVID(vid: string): boolean {
    return VID_PATTERN.test(vid.replace(/\s/g, ''));
}

export function validateCKYC(ckyc: string): boolean {
    return CKYC_PATTERN.test(ckyc.replace(/\s/g, ''));
}

export function validateGST(gst: string): boolean {
    return GST_PATTERN.test(gst.toUpperCase().trim());
}

export function validateAccountNumber(accountNumber: string): boolean {
    return ACCOUNT_NUMBER_PATTERN.test(accountNumber.replace(/\s/g, ''));
}

// Formatting Functions

export function formatMobile(mobile: string): string {
    const clean = mobile.replace(/[\s-]/g, '');
    if (clean.length === 10) {
        return `+91 ${clean.slice(0, 5)}-${clean.slice(5)}`;
    }
    if (clean.length === 12 && clean.startsWith('91')) {
        return `+91 ${clean.slice(2, 7)}-${clean.slice(7)}`;
    }
    return mobile;
}

export function formatPincode(pincode: string): string {
    const clean = pincode.replace(/\s/g, '');
    if (clean.length === 6) {
        return `${clean.slice(0, 3)} ${clean.slice(3)}`;
    }
    return pincode;
}

export function formatIFSC(ifsc: string): string {
    return ifsc.toUpperCase().trim();
}

// Mask Functions

export function maskMobile(mobile: string): string {
    const clean = mobile.replace(/[\s-+]/g, '');
    const digits = clean.slice(-10);
    if (digits.length !== 10) return mobile;
    return `XXXXXX${digits.slice(-4)}`;
}

export function maskAccountNumber(accountNumber: string): string {
    const clean = accountNumber.replace(/\s/g, '');
    if (clean.length < 4) return accountNumber;
    return 'X'.repeat(clean.length - 4) + clean.slice(-4);
}

// All patterns export
export const INDIAN_PATTERNS = {
    mobile: MOBILE_PATTERN,
    mobileWithCode: MOBILE_WITH_CODE_PATTERN,
    pincode: PINCODE_PATTERN,
    ifsc: IFSC_PATTERN,
    vid: VID_PATTERN,
    ckyc: CKYC_PATTERN,
    gst: GST_PATTERN,
    accountNumber: ACCOUNT_NUMBER_PATTERN,
    vehicle: VEHICLE_PATTERN,
};
