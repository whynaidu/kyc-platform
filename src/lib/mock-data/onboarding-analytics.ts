import { OnboardingFunnelStep, OnboardingDailyMetrics, OnboardingKPIs } from '@/types';

// Conversion funnel data
export const onboardingFunnel: OnboardingFunnelStep[] = [
    {
        step: 'mobile',
        stepNumber: 1,
        label: 'Mobile & Email',
        started: 10000,
        completed: 9200,
        dropoffs: 800,
        avgTimeSeconds: 180
    },
    {
        step: 'identity',
        stepNumber: 2,
        label: 'Identity (Aadhaar/PAN)',
        started: 9200,
        completed: 8100,
        dropoffs: 1100,
        avgTimeSeconds: 300
    },
    {
        step: 'video_kyc',
        stepNumber: 3,
        label: 'Video KYC',
        started: 8100,
        completed: 6800,
        dropoffs: 1300,
        avgTimeSeconds: 420
    },
    {
        step: 'address',
        stepNumber: 4,
        label: 'Address Verify',
        started: 6800,
        completed: 6500,
        dropoffs: 300,
        avgTimeSeconds: 120
    },
    {
        step: 'bank',
        stepNumber: 5,
        label: 'Bank Account',
        started: 6500,
        completed: 6200,
        dropoffs: 300,
        avgTimeSeconds: 150
    },
    {
        step: 'review',
        stepNumber: 6,
        label: 'Review & Submit',
        started: 6200,
        completed: 6000,
        dropoffs: 200,
        avgTimeSeconds: 90
    },
];

// Daily onboarding metrics generator
export function getOnboardingDailyMetrics(days: number = 30): OnboardingDailyMetrics[] {
    const metrics: OnboardingDailyMetrics[] = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        const started = Math.floor(280 + Math.random() * 120);
        const completed = Math.floor(started * (0.55 + Math.random() * 0.15));

        metrics.push({
            date: date.toISOString().split('T')[0],
            started,
            completed,
            avgTotalTimeMinutes: Math.floor(18 + Math.random() * 8),
            conversionRate: Math.round((completed / started) * 1000) / 10,
        });
    }

    return metrics;
}

// Time per step data
export function getTimePerStep() {
    return onboardingFunnel.map(step => ({
        step: step.label,
        avgTime: Math.round(step.avgTimeSeconds / 60 * 10) / 10,
        p50Time: Math.round(step.avgTimeSeconds * 0.85 / 60 * 10) / 10,
        p90Time: Math.round(step.avgTimeSeconds * 1.6 / 60 * 10) / 10,
    }));
}

// KPI calculations
export function getOnboardingKPIs(): OnboardingKPIs {
    const totalStarted = onboardingFunnel[0].started;
    const totalCompleted = onboardingFunnel[onboardingFunnel.length - 1].completed;
    const conversionRate = (totalCompleted / totalStarted) * 100;
    const totalDropoffs = totalStarted - totalCompleted;
    const dropoffRate = (totalDropoffs / totalStarted) * 100;
    const totalTimeSeconds = onboardingFunnel.reduce((sum, s) => sum + s.avgTimeSeconds, 0);

    return {
        totalStarted: {
            value: totalStarted,
            previousValue: 9200,
            changePercentage: 8.7,
            trend: 'up',
        },
        conversionRate: {
            value: Math.round(conversionRate * 10) / 10,
            previousValue: 58.2,
            changePercentage: 2.8,
            trend: 'up',
        },
        avgCompletionTime: {
            value: Math.round(totalTimeSeconds / 60),
            previousValue: 23,
            changePercentage: -8.3,
            trend: 'down',
        },
        dropoffRate: {
            value: Math.round(dropoffRate * 10) / 10,
            previousValue: 42.8,
            changePercentage: -2.8,
            trend: 'down',
        },
    };
}

// Completion time distribution
export function getCompletionTimeDistribution() {
    return [
        { range: '< 10 min', count: 850, percentage: 14.2 },
        { range: '10-15 min', count: 1450, percentage: 24.2 },
        { range: '15-20 min', count: 1680, percentage: 28.0 },
        { range: '20-30 min', count: 1320, percentage: 22.0 },
        { range: '30-45 min', count: 520, percentage: 8.7 },
        { range: '> 45 min', count: 180, percentage: 3.0 },
    ];
}
