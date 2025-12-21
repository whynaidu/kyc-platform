// Major Indian Banks with IFSC prefixes
export interface IndianBank {
    code: string;      // IFSC prefix (first 4 chars)
    name: string;
    shortName: string;
    type: 'public' | 'private' | 'foreign' | 'cooperative' | 'payment';
}

export const INDIAN_BANKS: IndianBank[] = [
    // Public Sector Banks
    { code: 'SBIN', name: 'State Bank of India', shortName: 'SBI', type: 'public' },
    { code: 'PUNB', name: 'Punjab National Bank', shortName: 'PNB', type: 'public' },
    { code: 'BARB', name: 'Bank of Baroda', shortName: 'BOB', type: 'public' },
    { code: 'CNRB', name: 'Canara Bank', shortName: 'Canara', type: 'public' },
    { code: 'UBIN', name: 'Union Bank of India', shortName: 'UBI', type: 'public' },
    { code: 'IOBA', name: 'Indian Overseas Bank', shortName: 'IOB', type: 'public' },
    { code: 'BKID', name: 'Bank of India', shortName: 'BOI', type: 'public' },
    { code: 'CBIN', name: 'Central Bank of India', shortName: 'CBI', type: 'public' },
    { code: 'UCBA', name: 'UCO Bank', shortName: 'UCO', type: 'public' },
    { code: 'PSIB', name: 'Punjab & Sind Bank', shortName: 'PSB', type: 'public' },
    { code: 'IBKL', name: 'IDBI Bank', shortName: 'IDBI', type: 'public' },
    { code: 'MAHB', name: 'Bank of Maharashtra', shortName: 'BOM', type: 'public' },

    // Private Sector Banks
    { code: 'HDFC', name: 'HDFC Bank', shortName: 'HDFC', type: 'private' },
    { code: 'ICIC', name: 'ICICI Bank', shortName: 'ICICI', type: 'private' },
    { code: 'UTIB', name: 'Axis Bank', shortName: 'Axis', type: 'private' },
    { code: 'KKBK', name: 'Kotak Mahindra Bank', shortName: 'Kotak', type: 'private' },
    { code: 'INDB', name: 'IndusInd Bank', shortName: 'IndusInd', type: 'private' },
    { code: 'YESB', name: 'Yes Bank', shortName: 'Yes', type: 'private' },
    { code: 'IDFB', name: 'IDFC First Bank', shortName: 'IDFC', type: 'private' },
    { code: 'FDRL', name: 'Federal Bank', shortName: 'Federal', type: 'private' },
    { code: 'RATN', name: 'RBL Bank', shortName: 'RBL', type: 'private' },
    { code: 'KARB', name: 'Karnataka Bank', shortName: 'KBL', type: 'private' },
    { code: 'KVBL', name: 'Karur Vysya Bank', shortName: 'KVB', type: 'private' },
    { code: 'SIBL', name: 'South Indian Bank', shortName: 'SIB', type: 'private' },
    { code: 'CSBK', name: 'CSB Bank', shortName: 'CSB', type: 'private' },
    { code: 'DLXB', name: 'Dhanlaxmi Bank', shortName: 'Dhanlaxmi', type: 'private' },
    { code: 'JAKA', name: 'Jammu & Kashmir Bank', shortName: 'J&K', type: 'private' },
    { code: 'TMBL', name: 'Tamilnad Mercantile Bank', shortName: 'TMB', type: 'private' },
    { code: 'CIUB', name: 'City Union Bank', shortName: 'CUB', type: 'private' },
    { code: 'DCBL', name: 'DCB Bank', shortName: 'DCB', type: 'private' },
    { code: 'LAVB', name: 'Lakshmi Vilas Bank', shortName: 'LVB', type: 'private' },
    { code: 'NKGS', name: 'Nainital Bank', shortName: 'Nainital', type: 'private' },

    // Payment Banks
    { code: 'PYTM', name: 'Paytm Payments Bank', shortName: 'Paytm', type: 'payment' },
    { code: 'AIRP', name: 'Airtel Payments Bank', shortName: 'Airtel', type: 'payment' },
    { code: 'JIOP', name: 'Jio Payments Bank', shortName: 'Jio', type: 'payment' },
    { code: 'FINO', name: 'Fino Payments Bank', shortName: 'Fino', type: 'payment' },

    // Foreign Banks
    { code: 'CITI', name: 'Citibank', shortName: 'Citi', type: 'foreign' },
    { code: 'HSBC', name: 'HSBC Bank', shortName: 'HSBC', type: 'foreign' },
    { code: 'SCBL', name: 'Standard Chartered Bank', shortName: 'StanChart', type: 'foreign' },
    { code: 'DEUT', name: 'Deutsche Bank', shortName: 'Deutsche', type: 'foreign' },
    { code: 'BNPA', name: 'BNP Paribas', shortName: 'BNP', type: 'foreign' },
    { code: 'DBSS', name: 'DBS Bank', shortName: 'DBS', type: 'foreign' },
];

export const getBankByCode = (code: string): IndianBank | undefined =>
    INDIAN_BANKS.find(b => b.code === code.toUpperCase());

export const getBankByIFSC = (ifsc: string): IndianBank | undefined => {
    const bankCode = ifsc.substring(0, 4).toUpperCase();
    return getBankByCode(bankCode);
};

export const getPublicBanks = (): IndianBank[] =>
    INDIAN_BANKS.filter(b => b.type === 'public');

export const getPrivateBanks = (): IndianBank[] =>
    INDIAN_BANKS.filter(b => b.type === 'private');
