import { DailyMetrics, RegionalStats, DashboardKPIs, AgentKPIs, AdminKPIs, ActivityItem, ActivityType } from '@/types';
import { mockUsers, regularUsers } from './users';
import { mockAgents, onlineAgents } from './agents';
import { mockKYCRecords, pendingRecords, verifiedRecords, failedRecords } from './kyc-records';

// Generate 30 days of metrics
function generateDailyMetrics(): DailyMetrics[] {
    const metrics: DailyMetrics[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        const total = Math.floor(Math.random() * 100) + 50;
        const successful = Math.floor(total * (0.7 + Math.random() * 0.2));

        metrics.push({
            date: date.toISOString().split('T')[0],
            totalVerifications: total,
            successfulVerifications: successful,
            failedVerifications: total - successful,
            avgCompletionTime: Math.floor(Math.random() * 300) + 120,
            faceLiveness: Math.floor(total * 0.3),
            faceMatch: Math.floor(total * 0.25),
            handwriting: Math.floor(total * 0.15),
            location: Math.floor(total * 0.15),
            videoKyc: Math.floor(total * 0.15),
        });
    }

    return metrics;
}

export const dailyMetrics = generateDailyMetrics();

// Regional statistics
export const regionalStats: RegionalStats[] = [
    { region: 'North America', country: 'United States', verifications: 3500, successRate: 92.5, avgTime: 185, lat: 39.8283, lng: -98.5795 },
    { region: 'North America', country: 'Canada', verifications: 890, successRate: 94.2, avgTime: 172, lat: 56.1304, lng: -106.3468 },
    { region: 'Europe', country: 'United Kingdom', verifications: 2100, successRate: 91.8, avgTime: 195, lat: 55.3781, lng: -3.4360 },
    { region: 'Europe', country: 'Germany', verifications: 1800, successRate: 93.1, avgTime: 178, lat: 51.1657, lng: 10.4515 },
    { region: 'Europe', country: 'France', verifications: 1200, successRate: 89.7, avgTime: 201, lat: 46.2276, lng: 2.2137 },
    { region: 'Asia Pacific', country: 'India', verifications: 4200, successRate: 88.5, avgTime: 215, lat: 20.5937, lng: 78.9629 },
    { region: 'Asia Pacific', country: 'Japan', verifications: 980, successRate: 95.3, avgTime: 162, lat: 36.2048, lng: 138.2529 },
    { region: 'Asia Pacific', country: 'Australia', verifications: 720, successRate: 93.8, avgTime: 175, lat: -25.2744, lng: 133.7751 },
    { region: 'South America', country: 'Brazil', verifications: 1500, successRate: 86.2, avgTime: 225, lat: -14.2350, lng: -51.9253 },
    { region: 'Middle East', country: 'UAE', verifications: 650, successRate: 94.5, avgTime: 168, lat: 23.4241, lng: 53.8478 },
];

// Dashboard KPIs
export function getDashboardKPIs(): DashboardKPIs {
    const todayMetrics = dailyMetrics[dailyMetrics.length - 1];
    const yesterdayMetrics = dailyMetrics[dailyMetrics.length - 2];

    const totalChange = ((todayMetrics.totalVerifications - yesterdayMetrics.totalVerifications) / yesterdayMetrics.totalVerifications) * 100;
    const successRateToday = (todayMetrics.successfulVerifications / todayMetrics.totalVerifications) * 100;
    const successRateYesterday = (yesterdayMetrics.successfulVerifications / yesterdayMetrics.totalVerifications) * 100;
    const successRateChange = successRateToday - successRateYesterday;
    const failedChange = ((todayMetrics.failedVerifications - yesterdayMetrics.failedVerifications) / yesterdayMetrics.failedVerifications) * 100;
    const timeChange = ((todayMetrics.avgCompletionTime - yesterdayMetrics.avgCompletionTime) / yesterdayMetrics.avgCompletionTime) * 100;

    return {
        totalVerifications: {
            value: todayMetrics.totalVerifications,
            previousValue: yesterdayMetrics.totalVerifications,
            changePercentage: Math.round(totalChange * 10) / 10,
            trend: totalChange >= 0 ? 'up' : 'down',
        },
        successRate: {
            value: Math.round(successRateToday * 10) / 10,
            previousValue: Math.round(successRateYesterday * 10) / 10,
            changePercentage: Math.round(successRateChange * 10) / 10,
            trend: successRateChange >= 0 ? 'up' : 'down',
        },
        failedAttempts: {
            value: todayMetrics.failedVerifications,
            previousValue: yesterdayMetrics.failedVerifications,
            changePercentage: Math.round(failedChange * 10) / 10,
            trend: failedChange <= 0 ? 'up' : 'down', // Less failures is up
        },
        avgCompletionTime: {
            value: todayMetrics.avgCompletionTime,
            previousValue: yesterdayMetrics.avgCompletionTime,
            changePercentage: Math.round(timeChange * 10) / 10,
            trend: timeChange <= 0 ? 'up' : 'down', // Less time is up
        },
    };
}

// Agent KPIs for a specific agent
export function getAgentKPIs(agentId: string): AgentKPIs {
    const agent = mockAgents.find(a => a.id === agentId) || mockAgents[0];

    return {
        todayVerifications: {
            value: agent.todayVerifications,
            previousValue: Math.floor(agent.todayVerifications * 0.9),
            changePercentage: 11.1,
            trend: 'up',
        },
        approvalRate: {
            value: Math.round(agent.approvalRate * 10) / 10,
            previousValue: Math.round((agent.approvalRate - 2) * 10) / 10,
            changePercentage: 2.3,
            trend: 'up',
        },
        avgSessionDuration: {
            value: agent.avgSessionDuration,
            previousValue: agent.avgSessionDuration + 15,
            changePercentage: -4.2,
            trend: 'up', // Shorter is better
        },
        customerSatisfaction: {
            value: Math.round(agent.customerSatisfaction * 10) / 10,
            previousValue: Math.round((agent.customerSatisfaction - 0.2) * 10) / 10,
            changePercentage: 4.5,
            trend: 'up',
        },
    };
}

// Admin KPIs
export function getAdminKPIs(): AdminKPIs {
    return {
        totalUsers: {
            value: mockUsers.length,
            previousValue: mockUsers.length - 5,
            changePercentage: 10.2,
            trend: 'up',
        },
        activeAgents: {
            value: onlineAgents.length,
            previousValue: onlineAgents.length - 1,
            changePercentage: 12.5,
            trend: 'up',
        },
        currentQueueLength: {
            value: pendingRecords.length,
            previousValue: pendingRecords.length + 3,
            changePercentage: -15.8,
            trend: 'up', // Less queue is better
        },
        systemHealth: {
            value: 99.8,
            previousValue: 99.5,
            changePercentage: 0.3,
            trend: 'up',
        },
    };
}

// Activity feed
function generateActivityFeed(): ActivityItem[] {
    const types: ActivityType[] = [
        'verification_completed',
        'verification_failed',
        'user_registered',
        'agent_status_changed',
        'video_session_started',
        'video_session_ended',
    ];

    const activities: ActivityItem[] = [];

    for (let i = 0; i < 20; i++) {
        const type = types[Math.floor(Math.random() * types.length)];
        const user = regularUsers[Math.floor(Math.random() * regularUsers.length)];
        const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000);

        let message = '';
        switch (type) {
            case 'verification_completed':
                message = `KYC verification completed for ${user.name}`;
                break;
            case 'verification_failed':
                message = `KYC verification failed for ${user.name}`;
                break;
            case 'user_registered':
                message = `New user registered: ${user.name}`;
                break;
            case 'agent_status_changed':
                message = `Agent ${mockAgents[Math.floor(Math.random() * mockAgents.length)]?.user.name} changed status`;
                break;
            case 'video_session_started':
                message = `Video KYC session started with ${user.name}`;
                break;
            case 'video_session_ended':
                message = `Video KYC session ended for ${user.name}`;
                break;
        }

        activities.push({
            id: `activity-${i + 1}`,
            type,
            message,
            userId: user.id,
            user,
            timestamp,
        });
    }

    return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export const activityFeed = generateActivityFeed();

// Method distribution for charts
export function getMethodDistribution() {
    const latest = dailyMetrics[dailyMetrics.length - 1];
    return [
        { name: 'Face Liveness', value: latest.faceLiveness, fill: 'var(--chart-1)' },
        { name: 'Face Match', value: latest.faceMatch, fill: 'var(--chart-2)' },
        { name: 'Handwriting', value: latest.handwriting, fill: 'var(--chart-3)' },
        { name: 'Location', value: latest.location, fill: 'var(--chart-4)' },
        { name: 'Video KYC', value: latest.videoKyc, fill: 'var(--chart-5)' },
    ];
}

// Verification trends for charts
export function getVerificationTrends(days: number = 30) {
    return dailyMetrics.slice(-days).map(m => ({
        date: m.date,
        successful: m.successfulVerifications,
        failed: m.failedVerifications,
        total: m.totalVerifications,
    }));
}
