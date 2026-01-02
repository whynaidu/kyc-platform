import { DeviceStats, OSStats, BrowserStats, NetworkStats } from '@/types';

// Device type breakdown
export const deviceStats: DeviceStats[] = [
    { deviceType: 'mobile', count: 65000, successRate: 91.2, avgCompletionTime: 285 },
    { deviceType: 'desktop', count: 28000, successRate: 94.8, avgCompletionTime: 225 },
    { deviceType: 'tablet', count: 7000, successRate: 89.5, avgCompletionTime: 310 },
];

// OS breakdown
export const osStats: OSStats[] = [
    { os: 'Android', count: 48000, successRate: 90.5, avgCompletionTime: 295 },
    { os: 'iOS', count: 17000, successRate: 93.2, avgCompletionTime: 265 },
    { os: 'Windows', count: 22000, successRate: 94.5, avgCompletionTime: 230 },
    { os: 'macOS', count: 6000, successRate: 95.8, avgCompletionTime: 215 },
    { os: 'Linux', count: 2000, successRate: 92.1, avgCompletionTime: 240 },
    { os: 'Other', count: 5000, successRate: 88.3, avgCompletionTime: 320 },
];

// Browser breakdown with compatibility issues
export const browserStats: BrowserStats[] = [
    {
        browser: 'Chrome',
        count: 58000,
        successRate: 93.5,
        compatibilityIssues: 120,
        commonIssues: ['Camera permission denied', 'WebRTC connection timeout']
    },
    {
        browser: 'Safari',
        count: 22000,
        successRate: 91.2,
        compatibilityIssues: 450,
        commonIssues: ['getUserMedia not supported in older versions', 'IndexedDB storage issues']
    },
    {
        browser: 'Firefox',
        count: 12000,
        successRate: 92.8,
        compatibilityIssues: 85,
        commonIssues: ['Camera stream quality issues', 'Pop-up blocked']
    },
    {
        browser: 'Edge',
        count: 5000,
        successRate: 93.1,
        compatibilityIssues: 45,
        commonIssues: ['Legacy Edge compatibility', 'Extension conflicts']
    },
    {
        browser: 'Other',
        count: 3000,
        successRate: 85.5,
        compatibilityIssues: 380,
        commonIssues: ['Unsupported features', 'JavaScript errors', 'Outdated browser']
    },
];

// Network quality impact
export const networkStats: NetworkStats[] = [
    { networkType: '5G', count: 15000, avgLatency: 25, dropoutRate: 1.2, avgCompletionTime: 195 },
    { networkType: '4G', count: 45000, avgLatency: 65, dropoutRate: 3.8, avgCompletionTime: 275 },
    { networkType: 'WiFi', count: 32000, avgLatency: 35, dropoutRate: 2.1, avgCompletionTime: 235 },
    { networkType: '3G', count: 5000, avgLatency: 180, dropoutRate: 12.5, avgCompletionTime: 420 },
    { networkType: 'Ethernet', count: 2500, avgLatency: 15, dropoutRate: 0.5, avgCompletionTime: 185 },
    { networkType: 'Unknown', count: 500, avgLatency: 200, dropoutRate: 15.2, avgCompletionTime: 480 },
];

// Getter functions for computed statistics
export function getDeviceKPIs() {
    const totalVerifications = deviceStats.reduce((sum, d) => sum + d.count, 0);
    const mobileShare = (deviceStats.find(d => d.deviceType === 'mobile')?.count || 0) / totalVerifications * 100;
    const avgSuccessRate = deviceStats.reduce((sum, d) => sum + d.successRate * d.count, 0) / totalVerifications;
    const totalBrowserIssues = browserStats.reduce((sum, b) => sum + b.compatibilityIssues, 0);

    return {
        totalVerifications: {
            value: totalVerifications,
            previousValue: 92000,
            changePercentage: 8.7,
            trend: 'up' as const,
        },
        mobileShare: {
            value: Math.round(mobileShare * 10) / 10,
            previousValue: 62.5,
            changePercentage: 2.4,
            trend: 'up' as const,
        },
        avgSuccessRate: {
            value: Math.round(avgSuccessRate * 10) / 10,
            previousValue: 91.2,
            changePercentage: 1.3,
            trend: 'up' as const,
        },
        browserIssues: {
            value: totalBrowserIssues,
            previousValue: 1250,
            changePercentage: -13.6,
            trend: 'down' as const,
        },
    };
}

// Daily device trends (last 14 days)
export function getDeviceTrends(days: number = 14) {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        trends.push({
            date: date.toISOString().split('T')[0],
            mobile: Math.floor(4000 + Math.random() * 1500),
            desktop: Math.floor(1500 + Math.random() * 800),
            tablet: Math.floor(400 + Math.random() * 200),
        });
    }

    return trends;
}
