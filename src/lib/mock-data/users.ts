import { User, UserRole, KYCStatus, UserStatus } from '@/types';

// Generate 50+ mock users
function generateUsers(): User[] {
    const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Chris', 'Amanda', 'Robert', 'Lisa', 'James', 'Jennifer', 'William', 'Ashley', 'Richard', 'Jessica', 'Joseph', 'Nicole', 'Thomas', 'Stephanie', 'Daniel', 'Elizabeth', 'Matthew', 'Michelle', 'Anthony'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris'];

    const roles: UserRole[] = ['admin', 'agent', 'user'];
    const kycStatuses: KYCStatus[] = ['pending', 'verified', 'failed', 'in_progress', 'not_started'];
    const userStatuses: UserStatus[] = ['active', 'inactive', 'suspended'];

    const users: User[] = [];

    // Admin users (3)
    for (let i = 0; i < 3; i++) {
        const firstName = firstNames[i];
        const lastName = lastNames[i];
        users.push({
            id: `admin-${i + 1}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@kyc-admin.com`,
            name: `${firstName} ${lastName}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
            role: 'admin',
            status: 'active',
            kycStatus: 'verified',
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            phone: `+1 (555) ${100 + i}-${1000 + i}`,
        });
    }

    // Agent users (12)
    for (let i = 0; i < 12; i++) {
        const firstName = firstNames[3 + i];
        const lastName = lastNames[3 + i];
        users.push({
            id: `agent-${i + 1}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@kyc-agents.com`,
            name: `${firstName} ${lastName}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
            role: 'agent',
            status: userStatuses[Math.floor(Math.random() * 2)], // Only active or inactive
            kycStatus: 'verified',
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            phone: `+1 (555) ${200 + i}-${2000 + i}`,
        });
    }

    // Regular users (40+)
    for (let i = 0; i < 40; i++) {
        const firstName = firstNames[i % firstNames.length];
        const lastName = lastNames[(i + 5) % lastNames.length];
        const kycStatus = kycStatuses[Math.floor(Math.random() * kycStatuses.length)];
        users.push({
            id: `user-${i + 1}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`,
            name: `${firstName} ${lastName}`,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}${i}`,
            role: 'user',
            status: userStatuses[Math.floor(Math.random() * userStatuses.length)],
            kycStatus,
            createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
            updatedAt: new Date(),
            phone: `+1 (555) ${300 + i}-${3000 + i}`,
            address: `${100 + i} Main Street, City ${i + 1}, State ${i % 50}`,
        });
    }

    return users;
}

export const mockUsers = generateUsers();

export const adminUsers = mockUsers.filter(u => u.role === 'admin');
export const agentUsers = mockUsers.filter(u => u.role === 'agent');
export const regularUsers = mockUsers.filter(u => u.role === 'user');

// Demo credentials for login
export const demoCredentials = {
    admin: { email: 'john.smith@kyc-admin.com', password: 'admin123' },
    agent: { email: 'sarah.brown@kyc-agents.com', password: 'agent123' },
    user: { email: 'john.garcia0@email.com', password: 'user123' },
};
