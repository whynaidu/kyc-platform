// PAN (Permanent Account Number) Validation
// Format: ABCPS1234K (10 characters)
// Position 1-3: Letters (A-Z)
// Position 4: Entity type (P=Person, C=Company, H=HUF, F=Firm, etc.)
// Position 5: First letter of surname/name
// Position 6-9: Sequential digits (0001-9999)
// Position 10: Alphabetic check character

// Valid entity types for 4th character
export const PAN_ENTITY_TYPES: Record<string, string> = {
    'A': 'Association of Persons (AOP)',
    'B': 'Body of Individuals (BOI)',
    'C': 'Company',
    'F': 'Firm',
    'G': 'Government',
    'H': 'Hindu Undivided Family (HUF)',
    'J': 'Artificial Juridical Person',
    'L': 'Local Authority',
    'P': 'Individual/Person',
    'T': 'Trust (AOP)',
};

// Full PAN pattern: 3 letters + entity type + 1 letter + 4 digits + 1 letter
export const PAN_PATTERN = /^[A-Z]{3}[ABCFGHJLPT][A-Z]\d{4}[A-Z]$/;

/**
 * Validates PAN number format
 * @param pan - 10-character PAN number
 * @returns boolean - true if valid format
 */
export function validatePAN(pan: string): boolean {
    const cleanPAN = pan.toUpperCase().replace(/\s/g, '');
    return PAN_PATTERN.test(cleanPAN);
}

/**
 * Gets entity type description from PAN
 * @param pan - PAN number
 * @returns Entity type description or undefined
 */
export function getPANEntityType(pan: string): string | undefined {
    const cleanPAN = pan.toUpperCase().replace(/\s/g, '');
    if (cleanPAN.length < 4) return undefined;
    return PAN_ENTITY_TYPES[cleanPAN[3]];
}

/**
 * Checks if PAN belongs to an individual
 * @param pan - PAN number
 * @returns boolean - true if individual PAN
 */
export function isIndividualPAN(pan: string): boolean {
    const cleanPAN = pan.toUpperCase().replace(/\s/g, '');
    return cleanPAN.length >= 4 && cleanPAN[3] === 'P';
}

/**
 * Checks if PAN belongs to a company
 * @param pan - PAN number
 * @returns boolean - true if company PAN
 */
export function isCompanyPAN(pan: string): boolean {
    const cleanPAN = pan.toUpperCase().replace(/\s/g, '');
    return cleanPAN.length >= 4 && cleanPAN[3] === 'C';
}

/**
 * Masks PAN for display (ABCPX****Y)
 * @param pan - Full PAN number
 * @returns Masked PAN string
 */
export function maskPAN(pan: string): string {
    const cleanPAN = pan.toUpperCase().replace(/\s/g, '');
    if (cleanPAN.length !== 10) return pan;
    return `${cleanPAN.slice(0, 5)}****${cleanPAN.slice(-1)}`;
}

/**
 * Generates a valid random PAN for testing
 * @param entityType - Entity type (default: 'P' for individual)
 * @returns A valid format PAN number
 */
export function generateTestPAN(entityType: string = 'P'): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetter = () => letters[Math.floor(Math.random() * 26)];

    // First 3 random letters
    const first3 = randomLetter() + randomLetter() + randomLetter();

    // 4th character - entity type
    const entity = PAN_ENTITY_TYPES[entityType] ? entityType : 'P';

    // 5th character - random letter (represents first letter of name)
    const nameLetter = randomLetter();

    // 6-9: Sequential 4 digits
    const digits = String(Math.floor(Math.random() * 9000) + 1000);

    // 10th character - random letter (check character)
    const checkLetter = randomLetter();

    return first3 + entity + nameLetter + digits + checkLetter;
}
