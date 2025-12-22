import { User, KYCStatus, UserStatus } from '@/types';
import { generateTestAadhaar } from '@/lib/validators/aadhaar';
import { generateTestPAN } from '@/lib/validators/pan';

// Diverse Indian names (North, South, East, West, Sikh, Muslim, Christian)
const indianFirstNames = [
    // North India
    'Rahul', 'Priya', 'Amit', 'Sneha', 'Vikram', 'Pooja', 'Arun', 'Neha',
    'Suresh', 'Kavita', 'Rajesh', 'Anita', 'Deepak', 'Sunita', 'Naveen', 'Rekha',
    // South India
    'Venkatesh', 'Lakshmi', 'Raghavan', 'Meenakshi', 'Subramaniam', 'Padma',
    'Krishnan', 'Geetha', 'Ramesh', 'Saroja', 'Mohan', 'Vani',
    // Sikh names
    'Harpreet', 'Simran', 'Gurpreet', 'Jasleen', 'Manpreet', 'Ravinder',
    // Muslim names  
    'Mohammed', 'Fatima', 'Aamir', 'Ayesha', 'Imran', 'Zainab',
    // Christian names
    'John', 'Mary', 'Joseph', 'Teresa', 'Anthony', 'Grace',
    // Bengali names
    'Sourav', 'Rina', 'Debashish', 'Ananya', 'Partha', 'Moumita',
    // Gujarati names
    'Jignesh', 'Hetal', 'Chirag', 'Komal', 'Ketan', 'Sejal',
];

const indianLastNames = [
    // North India
    'Sharma', 'Gupta', 'Singh', 'Verma', 'Jain', 'Agarwal', 'Mishra', 'Pandey',
    'Chauhan', 'Yadav', 'Saxena', 'Sharma', 'Kapoor', 'Malhotra',
    // South India
    'Iyer', 'Iyengar', 'Nair', 'Menon', 'Pillai', 'Reddy', 'Rao', 'Naidu',
    'Krishnamurthy', 'Subramaniam', 'Rajan', 'Venkataraman',
    // Maharashtra/Gujarat
    'Patil', 'Deshmukh', 'Kulkarni', 'Joshi', 'Patel', 'Shah', 'Mehta', 'Desai',
    // Sikh
    'Singh', 'Kaur', 'Sandhu', 'Dhillon', 'Sidhu', 'Gill',
    // Muslim
    'Khan', 'Syed', 'Sheikh', 'Ansari', 'Qureshi', 'Pathan',
    // Bengali
    'Banerjee', 'Chatterjee', 'Mukherjee', 'Ghosh', 'Das', 'Sen',
    // Christian
    'Thomas', 'Joseph', 'George', 'Mathew', 'Philip', 'Abraham',
];

const indianCities = [
    { city: 'Mumbai', state: 'Maharashtra', pinPrefix: '400' },
    { city: 'Delhi', state: 'Delhi', pinPrefix: '110' },
    { city: 'Bengaluru', state: 'Karnataka', pinPrefix: '560' },
    { city: 'Hyderabad', state: 'Telangana', pinPrefix: '500' },
    { city: 'Chennai', state: 'Tamil Nadu', pinPrefix: '600' },
    { city: 'Kolkata', state: 'West Bengal', pinPrefix: '700' },
    { city: 'Pune', state: 'Maharashtra', pinPrefix: '411' },
    { city: 'Ahmedabad', state: 'Gujarat', pinPrefix: '380' },
    { city: 'Jaipur', state: 'Rajasthan', pinPrefix: '302' },
    { city: 'Lucknow', state: 'Uttar Pradesh', pinPrefix: '226' },
    { city: 'Chandigarh', state: 'Punjab', pinPrefix: '160' },
    { city: 'Kochi', state: 'Kerala', pinPrefix: '682' },
    { city: 'Gurugram', state: 'Haryana', pinPrefix: '122' },
    { city: 'Noida', state: 'Uttar Pradesh', pinPrefix: '201' },
    { city: 'Indore', state: 'Madhya Pradesh', pinPrefix: '452' },
];

const emailDomains = ['gmail.com', 'yahoo.co.in', 'rediffmail.com', 'outlook.com', 'hotmail.com'];

// Generate Indian mobile number (starts with 6-9)
function generateMobile(): string {
    const prefix = String(Math.floor(Math.random() * 4) + 6);
    const number = String(Math.floor(Math.random() * 900000000) + 100000000);
    return `+91 ${prefix}${number.slice(0, 4)}-${number.slice(4)}`;
}

// Generate 50+ mock users with Indian data
function generateUsers(): User[] {
    const kycStatuses: KYCStatus[] = ['pending', 'verified', 'failed', 'in_progress', 'not_started'];
    const userStatuses: UserStatus[] = ['active', 'inactive', 'suspended'];

    const users: User[] = [];

    // Admin users (3)
    const adminNames = [
        { first: 'Rajesh', last: 'Sharma' },
        { first: 'Priya', last: 'Iyer' },
        { first: 'Amit', last: 'Patel' },
    ];

    for (let i = 0; i < 3; i++) {
        const { first, last } = adminNames[i];
        const cityData = indianCities[i % indianCities.length];
        users.push({
            id: `admin-${i + 1}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}@kyc-admin.in`,
            name: `${first} ${last}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${first}${last}`,
            role: 'admin',
            status: 'active',
            kycStatus: 'verified',
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            phone: generateMobile(),
            address: `${100 + i}, Sector ${10 + i}, ${cityData.city}, ${cityData.state} - ${cityData.pinPrefix}0${i + 1}`,
            aadhaar: generateTestAadhaar(),
            pan: generateTestPAN(),
        });
    }

    // Agent users (12)
    for (let i = 0; i < 12; i++) {
        const firstName = indianFirstNames[(i + 5) % indianFirstNames.length];
        const lastName = indianLastNames[(i + 3) % indianLastNames.length];
        const cityData = indianCities[(i + 2) % indianCities.length];
        users.push({
            id: `agent-${i + 1}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@kyc-agents.in`,
            name: `${firstName} ${lastName}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
            role: 'agent',
            status: userStatuses[Math.floor(Math.random() * 2)], // Only active or inactive
            kycStatus: 'verified',
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            phone: generateMobile(),
            address: `Flat ${100 + i}, Tower ${String.fromCharCode(65 + (i % 10))}, ${cityData.city}, ${cityData.state} - ${cityData.pinPrefix}0${(i % 9) + 1}`,
            aadhaar: generateTestAadhaar(),
            pan: generateTestPAN(),
        });
    }

    // Regular users (40+)
    for (let i = 0; i < 45; i++) {
        const firstName = indianFirstNames[i % indianFirstNames.length];
        const lastName = indianLastNames[(i + 7) % indianLastNames.length];
        const kycStatus = kycStatuses[Math.floor(Math.random() * kycStatuses.length)];
        const cityData = indianCities[i % indianCities.length];
        const domain = emailDomains[i % emailDomains.length];

        users.push({
            id: `user-${i + 1}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 0 ? i : ''}@${domain}`,
            name: `${firstName} ${lastName}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
            role: 'user',
            status: userStatuses[Math.floor(Math.random() * userStatuses.length)],
            kycStatus,
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            phone: generateMobile(),
            address: `${i + 1}/${String.fromCharCode(65 + (i % 26))}, ${['MG Road', 'Gandhi Nagar', 'Nehru Place', 'Anna Salai', 'Park Street'][i % 5]}, ${cityData.city}, ${cityData.state} - ${cityData.pinPrefix}0${(i % 9) + 1}`,
            aadhaar: generateTestAadhaar(),
            pan: generateTestPAN(),
        });
    }

    return users;
}

export const mockUsers = generateUsers();

export const adminUsers = mockUsers.filter(u => u.role === 'admin');
export const agentUsers = mockUsers.filter(u => u.role === 'agent');
export const regularUsers = mockUsers.filter(u => u.role === 'user');

// Demo credentials for login (Indian format)
// Note: These must match the generated users above
// Admin: adminNames[0] = Rajesh Sharma
// Agent: indianFirstNames[(0+5)] = Pooja, indianLastNames[(0+3)] = Verma
// User: indianFirstNames[0] = Rahul, indianLastNames[(0+7)] = Pandey
export const demoCredentials = {
    admin: { email: 'rajesh.sharma@kyc-admin.in', password: 'admin123' },
    agent: { email: 'pooja.verma@kyc-agents.in', password: 'agent123' },
    user: { email: 'rahul.pandey@gmail.com', password: 'user123' },
};
