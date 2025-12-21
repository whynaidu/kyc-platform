// Indian Number and Date Formatting Utilities

/**
 * Formats a number using Indian numbering system (Lakh, Crore)
 * Example: 1234567 → "12,34,567"
 * @param num - Number to format
 * @returns Formatted string with Indian comma placement
 */
export function formatIndianNumber(num: number): string {
    const numStr = Math.abs(Math.floor(num)).toString();

    if (numStr.length <= 3) {
        return (num < 0 ? '-' : '') + numStr;
    }

    // Last 3 digits
    const lastThree = numStr.slice(-3);
    // Remaining digits
    const remaining = numStr.slice(0, -3);

    // Add commas every 2 digits for remaining
    const formatted = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');

    return (num < 0 ? '-' : '') + formatted + ',' + lastThree;
}

/**
 * Formats a number as Indian currency (₹)
 * Example: 1234567.50 → "₹12,34,567.50"
 * @param amount - Amount to format
 * @param showPaise - Whether to show paise (default: true)
 * @returns Formatted currency string
 */
export function formatIndianCurrency(amount: number, showPaise: boolean = true): string {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    if (showPaise) {
        const intPart = Math.floor(absAmount);
        const decPart = Math.round((absAmount - intPart) * 100);
        const paise = decPart > 0 ? '.' + String(decPart).padStart(2, '0') : '';
        return `${sign}₹${formatIndianNumber(intPart)}${paise}`;
    }

    return `${sign}₹${formatIndianNumber(Math.round(absAmount))}`;
}

/**
 * Converts number to Indian words (Lakh, Crore, Arab)
 * Example: 1234567 → "12.35 Lakh"
 * @param num - Number to convert
 * @param precision - Decimal places (default: 2)
 * @returns Human-readable Indian format
 */
export function formatIndianWords(num: number, precision: number = 2): string {
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';

    if (absNum >= 1_00_00_00_000) { // 1 Arab (10 billion)
        return `${sign}${(absNum / 1_00_00_00_000).toFixed(precision)} Arab`;
    }
    if (absNum >= 1_00_00_000) { // 1 Crore (10 million)
        return `${sign}${(absNum / 1_00_00_000).toFixed(precision)} Cr`;
    }
    if (absNum >= 1_00_000) { // 1 Lakh (100 thousand)
        return `${sign}${(absNum / 1_00_000).toFixed(precision)} L`;
    }
    if (absNum >= 1_000) { // 1 Thousand
        return `${sign}${(absNum / 1_000).toFixed(precision)} K`;
    }

    return `${sign}${absNum.toFixed(precision)}`;
}

/**
 * Formats date as DD/MM/YYYY (Indian standard)
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatIndianDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/**
 * Formats date as "DD Mon YYYY" (e.g., "22 Dec 2024")
 * @param date - Date to format
 * @returns Formatted date string
 */
export function formatIndianDateLong(date: Date): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

/**
 * Formats datetime as "DD/MM/YYYY, HH:MM AM/PM IST"
 * @param date - Date to format
 * @returns Formatted datetime string
 */
export function formatIndianDateTime(date: Date): string {
    const dateStr = formatIndianDate(date);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${dateStr}, ${displayHours}:${minutes} ${ampm} IST`;
}

/**
 * Formats datetime as "DD Mon YYYY, HH:MM AM/PM IST"
 * @param date - Date to format
 * @returns Formatted datetime string
 */
export function formatIndianDateTimeLong(date: Date): string {
    const dateStr = formatIndianDateLong(date);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${dateStr}, ${displayHours}:${minutes} ${ampm} IST`;
}

/**
 * Parses DD/MM/YYYY string to Date
 * @param dateStr - Date string in DD/MM/YYYY format
 * @returns Date object or null if invalid
 */
export function parseIndianDate(dateStr: string): Date | null {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

    const date = new Date(year, month, day);

    // Validate the date is correct
    if (date.getDate() !== day || date.getMonth() !== month || date.getFullYear() !== year) {
        return null;
    }

    return date;
}

/**
 * Gets relative time in human-readable format
 * @param date - Date to compare
 * @returns Relative time string (e.g., "2 hours ago")
 */
export function getRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return formatIndianDateLong(date);
}

/**
 * Format file size in Indian readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
