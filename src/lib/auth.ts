import { AuthUser, UserRole, Permission, PermissionModule } from '@/types';
import { mockUsers, demoCredentials } from './mock-data/users';

const AUTH_STORAGE_KEY = 'kyc_auth_user';

// Permission definitions by role
const rolePermissions: Record<UserRole, Permission[]> = {
    admin: [
        { module: 'dashboard', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'kyc', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'video_kyc', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'users', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'agents', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'analytics', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'settings', actions: ['view', 'create', 'edit', 'delete'] },
        { module: 'roles', actions: ['view', 'create', 'edit', 'delete'] },
    ],
    agent: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'kyc', actions: ['view', 'create', 'edit'] },
        { module: 'video_kyc', actions: ['view', 'create', 'edit'] },
        { module: 'analytics', actions: ['view'] },
    ],
    user: [
        { module: 'dashboard', actions: ['view'] },
        { module: 'kyc', actions: ['view', 'create'] },
        { module: 'video_kyc', actions: ['view', 'create'] },
    ],
};

// Mock login function
export async function login(email: string, password: string): Promise<AuthUser | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check demo credentials
    const isValidDemo =
        (email === demoCredentials.admin.email && password === demoCredentials.admin.password) ||
        (email === demoCredentials.agent.email && password === demoCredentials.agent.password) ||
        (email === demoCredentials.user.email && password === demoCredentials.user.password);

    if (!isValidDemo) {
        // Allow any user from mock data with password "password123"
        const user = mockUsers.find(u => u.email === email);
        if (!user || password !== 'password123') {
            return null;
        }
    }

    const user = mockUsers.find(u => u.email === email);
    if (!user) return null;

    const authUser: AuthUser = {
        ...user,
        permissions: rolePermissions[user.role],
    };

    // Store in localStorage
    if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    }

    return authUser;
}

// Logout function
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY);
    }
}

// Get current user
export function getCurrentUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as AuthUser;
    } catch {
        return null;
    }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
    return getCurrentUser() !== null;
}

// Check if user has permission
export function hasPermission(module: PermissionModule, action: 'view' | 'create' | 'edit' | 'delete'): boolean {
    const user = getCurrentUser();
    if (!user) return false;

    const permission = user.permissions.find(p => p.module === module);
    return permission?.actions.includes(action) ?? false;
}

// Check if user has role
export function hasRole(role: UserRole | UserRole[]): boolean {
    const user = getCurrentUser();
    if (!user) return false;

    if (Array.isArray(role)) {
        return role.includes(user.role);
    }
    return user.role === role;
}

// Get protected routes by role
export function getProtectedRoutes(): Record<string, UserRole[]> {
    return {
        '/admin': ['admin'],
        '/admin/agents': ['admin'],
        '/admin/users': ['admin'],
        '/admin/roles': ['admin'],
        '/agent': ['admin', 'agent'],
        '/agent/queue': ['admin', 'agent'],
        '/agent/performance': ['admin', 'agent'],
        '/agent/video-session': ['admin', 'agent'],
    };
}
