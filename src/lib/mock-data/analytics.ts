import { DailyMetrics, RegionalStats, DashboardKPIs, AgentKPIs, AdminKPIs, ActivityItem, ActivityType } from '@/types';
import { mockUsers, regularUsers } from './users';
import { mockAgents, onlineAgents } from './agents';
import { pendingRecords } from './kyc-records';
import { formatIndianNumber } from '@/lib/utils/indian-format';

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

// Indian State-wise Statistics (replacing country-based)
export const regionalStats: RegionalStats[] = [
    // Top states by KYC volume
    { region: 'West', country: 'Maharashtra', verifications: 45000, successRate: 94.2, avgTime: 185, lat: 19.076, lng: 72.8777 },
    { region: 'South', country: 'Karnataka', verifications: 38000, successRate: 95.1, avgTime: 172, lat: 12.9716, lng: 77.5946 },
    { region: 'North', country: 'Delhi', verifications: 35000, successRate: 93.8, avgTime: 195, lat: 28.6139, lng: 77.209 },
    { region: 'South', country: 'Tamil Nadu', verifications: 32000, successRate: 94.5, avgTime: 178, lat: 13.0827, lng: 80.2707 },
    { region: 'South', country: 'Telangana', verifications: 28000, successRate: 93.2, avgTime: 188, lat: 17.385, lng: 78.4867 },
    { region: 'North', country: 'Uttar Pradesh', verifications: 25000, successRate: 91.5, avgTime: 210, lat: 26.8467, lng: 80.9462 },
    { region: 'West', country: 'Gujarat', verifications: 22000, successRate: 94.8, avgTime: 175, lat: 23.0225, lng: 72.5714 },
    { region: 'East', country: 'West Bengal', verifications: 18000, successRate: 92.3, avgTime: 198, lat: 22.5726, lng: 88.3639 },
    { region: 'North', country: 'Rajasthan', verifications: 15000, successRate: 90.8, avgTime: 205, lat: 26.9124, lng: 75.7873 },
    { region: 'North', country: 'Haryana', verifications: 14000, successRate: 93.5, avgTime: 182, lat: 28.4595, lng: 77.0266 },
    { region: 'North', country: 'Punjab', verifications: 12000, successRate: 94.0, avgTime: 178, lat: 30.901, lng: 75.8573 },
    { region: 'South', country: 'Kerala', verifications: 11000, successRate: 96.2, avgTime: 162, lat: 9.9312, lng: 76.2673 },
    { region: 'North', country: 'Madhya Pradesh', verifications: 9500, successRate: 91.0, avgTime: 215, lat: 23.2599, lng: 77.4126 },
    { region: 'East', country: 'Bihar', verifications: 8000, successRate: 88.5, avgTime: 225, lat: 25.5941, lng: 85.1376 },
    { region: 'East', country: 'Jharkhand', verifications: 6000, successRate: 89.2, avgTime: 218, lat: 23.3441, lng: 85.3096 },
    { region: 'East', country: 'Odisha', verifications: 5500, successRate: 90.5, avgTime: 208, lat: 20.2961, lng: 85.8245 },
    { region: 'North-East', country: 'Assam', verifications: 4000, successRate: 91.8, avgTime: 195, lat: 26.1445, lng: 91.7362 },
    { region: 'South', country: 'Andhra Pradesh', verifications: 9000, successRate: 93.0, avgTime: 188, lat: 16.5062, lng: 80.648 },
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

// Activity feed with Indian context
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

// Get top Indian states by verifications
export function getTopStates(count: number = 10) {
    return [...regionalStats]
        .sort((a, b) => b.verifications - a.verifications)
        .slice(0, count);
}

// Get total verifications (for display with Indian formatting)
export function getTotalVerifications(): string {
    const total = regionalStats.reduce((sum, r) => sum + r.verifications, 0);
    return formatIndianNumber(total);
}
