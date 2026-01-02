import { OnboardingStepFailure, OnboardingDropoffTiming, OnboardingFailureKPIs } from '@/types';

// Onboarding step failure breakdown
export const onboardingStepFailures: OnboardingStepFailure[] = [
    {
        step: 'mobile',
        label: 'Mobile & Email',
        dropoffs: 800,
        dropoffRate: 8.0,
        topReasons: [
            { reason: 'OTP not received', count: 320, percentage: 40.0 },
            { reason: 'Invalid mobile number', count: 200, percentage: 25.0 },
            { reason: 'Abandoned during OTP wait', count: 180, percentage: 22.5 },
            { reason: 'Email verification failed', count: 100, percentage: 12.5 },
        ],
    },
    {
        step: 'identity',
        label: 'Identity (Aadhaar/PAN)',
        dropoffs: 1100,
        dropoffRate: 12.0,
        topReasons: [
            { reason: 'Aadhaar not linked to mobile', count: 385, percentage: 35.0 },
            { reason: 'Invalid document number', count: 275, percentage: 25.0 },
            { reason: 'Verification service unavailable', count: 198, percentage: 18.0 },
            { reason: 'PAN-Aadhaar not linked', count: 154, percentage: 14.0 },
            { reason: 'User abandoned', count: 88, percentage: 8.0 },
        ],
    },
    {
        step: 'video_kyc',
        label: 'Video KYC',
        dropoffs: 1300,
        dropoffRate: 16.0,
        topReasons: [
            { reason: 'Long wait time', count: 390, percentage: 30.0 },
            { reason: 'Camera/mic permission denied', count: 299, percentage: 23.0 },
            { reason: 'Network issues', count: 260, percentage: 20.0 },
            { reason: 'Verification failed', count: 195, percentage: 15.0 },
            { reason: 'Agent unavailable (off hours)', count: 156, percentage: 12.0 },
        ],
    },
    {
        step: 'address',
        label: 'Address Verify',
        dropoffs: 300,
        dropoffRate: 4.4,
        topReasons: [
            { reason: 'Invalid PIN code', count: 105, percentage: 35.0 },
            { reason: 'Address mismatch with Aadhaar', count: 75, percentage: 25.0 },
            { reason: 'DigiLocker connection failed', count: 60, percentage: 20.0 },
            { reason: 'Document upload issues', count: 45, percentage: 15.0 },
            { reason: 'User abandoned', count: 15, percentage: 5.0 },
        ],
    },
    {
        step: 'bank',
        label: 'Bank Account',
        dropoffs: 300,
        dropoffRate: 4.6,
        topReasons: [
            { reason: 'Penny drop failed', count: 105, percentage: 35.0 },
            { reason: 'Invalid IFSC code', count: 75, percentage: 25.0 },
            { reason: 'Name mismatch', count: 60, percentage: 20.0 },
            { reason: 'Account number error', count: 45, percentage: 15.0 },
            { reason: 'Bank service unavailable', count: 15, percentage: 5.0 },
        ],
    },
    {
        step: 'review',
        label: 'Review & Submit',
        dropoffs: 200,
        dropoffRate: 3.2,
        topReasons: [
            { reason: 'User abandoned at final step', count: 100, percentage: 50.0 },
            { reason: 'Wanted to edit previous info', count: 60, percentage: 30.0 },
            { reason: 'Submission error', count: 30, percentage: 15.0 },
            { reason: 'Session timeout', count: 10, percentage: 5.0 },
        ],
    },
];

// Drop-off timing patterns by step
export const dropoffTimingByStep: Record<string, OnboardingDropoffTiming[]> = {
    mobile: [
        { timeRange: '0-30s', count: 120, percentage: 15.0 },
        { timeRange: '30s-1m', count: 200, percentage: 25.0 },
        { timeRange: '1-2m', count: 280, percentage: 35.0 },
        { timeRange: '2-3m', count: 160, percentage: 20.0 },
        { timeRange: '> 3m', count: 40, percentage: 5.0 },
    ],
    identity: [
        { timeRange: '0-1m', count: 165, percentage: 15.0 },
        { timeRange: '1-3m', count: 330, percentage: 30.0 },
        { timeRange: '3-5m', count: 385, percentage: 35.0 },
        { timeRange: '5-10m', count: 165, percentage: 15.0 },
        { timeRange: '> 10m', count: 55, percentage: 5.0 },
    ],
    video_kyc: [
        { timeRange: '0-2m (waiting)', count: 260, percentage: 20.0 },
        { timeRange: '2-5m (waiting)', count: 390, percentage: 30.0 },
        { timeRange: '5-10m (waiting)', count: 325, percentage: 25.0 },
        { timeRange: 'During call', count: 260, percentage: 20.0 },
        { timeRange: 'Post call', count: 65, percentage: 5.0 },
    ],
    address: [
        { timeRange: '0-30s', count: 45, percentage: 15.0 },
        { timeRange: '30s-1m', count: 90, percentage: 30.0 },
        { timeRange: '1-2m', count: 120, percentage: 40.0 },
        { timeRange: '> 2m', count: 45, percentage: 15.0 },
    ],
    bank: [
        { timeRange: '0-1m', count: 60, percentage: 20.0 },
        { timeRange: '1-2m', count: 105, percentage: 35.0 },
        { timeRange: '2-3m', count: 90, percentage: 30.0 },
        { timeRange: '> 3m', count: 45, percentage: 15.0 },
    ],
    review: [
        { timeRange: '0-30s', count: 40, percentage: 20.0 },
        { timeRange: '30s-1m', count: 80, percentage: 40.0 },
        { timeRange: '1-2m', count: 60, percentage: 30.0 },
        { timeRange: '> 2m', count: 20, percentage: 10.0 },
    ],
};

// Daily drop-off trends
export function getDropoffTrends(days: number = 14) {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        trends.push({
            date: date.toISOString().split('T')[0],
            mobile: Math.floor(22 + Math.random() * 12),
            identity: Math.floor(32 + Math.random() * 16),
            video_kyc: Math.floor(38 + Math.random() * 20),
            address: Math.floor(8 + Math.random() * 6),
            bank: Math.floor(8 + Math.random() * 6),
            review: Math.floor(5 + Math.random() * 4),
        });
    }

    return trends;
}

// KPI calculations
export function getOnboardingFailureKPIs(): OnboardingFailureKPIs {
    const totalDropoffs = onboardingStepFailures.reduce((sum, s) => sum + s.dropoffs, 0);

    // Find highest drop-off step
    const highestStep = onboardingStepFailures.reduce((max, s) =>
        s.dropoffRate > max.dropoffRate ? s : max
    );

    // Calculate avg drop-off time (weighted by dropoffs)
    const avgTimes: Record<string, number> = {
        mobile: 75, // 1m 15s avg
        identity: 210, // 3m 30s avg
        video_kyc: 300, // 5m avg
        address: 75, // 1m 15s avg
        bank: 120, // 2m avg
        review: 45, // 45s avg
    };

    const weightedTime = onboardingStepFailures.reduce(
        (sum, s) => sum + (avgTimes[s.step] || 60) * s.dropoffs, 0
    ) / totalDropoffs;

    return {
        totalDropoffs: {
            value: totalDropoffs,
            previousValue: 4200,
            changePercentage: -4.8,
            trend: 'down',
        },
        highestDropoffStep: {
            step: highestStep.label,
            rate: highestStep.dropoffRate,
        },
        avgDropoffTime: {
            value: Math.round(weightedTime / 60 * 10) / 10,
            previousValue: 3.2,
            changePercentage: -6.3,
            trend: 'down',
        },
        recoveryRate: {
            value: 18.5,
            previousValue: 15.2,
            changePercentage: 21.7,
            trend: 'up',
        },
    };
}

// User journey flow data (for Sankey-style visualization)
export function getUserJourneyFlow() {
    return {
        started: 10000,
        steps: [
            { from: 'start', to: 'mobile', count: 10000 },
            { from: 'mobile', to: 'identity', count: 9200 },
            { from: 'mobile', to: 'dropped', count: 800 },
            { from: 'identity', to: 'video_kyc', count: 8100 },
            { from: 'identity', to: 'dropped', count: 1100 },
            { from: 'video_kyc', to: 'address', count: 6800 },
            { from: 'video_kyc', to: 'dropped', count: 1300 },
            { from: 'address', to: 'bank', count: 6500 },
            { from: 'address', to: 'dropped', count: 300 },
            { from: 'bank', to: 'review', count: 6200 },
            { from: 'bank', to: 'dropped', count: 300 },
            { from: 'review', to: 'completed', count: 6000 },
            { from: 'review', to: 'dropped', count: 200 },
        ],
    };
}

// Recovery rates by step (users who came back)
export function getRecoveryRates() {
    return [
        { step: 'mobile', dropoffs: 800, recovered: 120, rate: 15.0 },
        { step: 'identity', dropoffs: 1100, recovered: 198, rate: 18.0 },
        { step: 'video_kyc', dropoffs: 1300, recovered: 286, rate: 22.0 },
        { step: 'address', dropoffs: 300, recovered: 48, rate: 16.0 },
        { step: 'bank', dropoffs: 300, recovered: 51, rate: 17.0 },
        { step: 'review', dropoffs: 200, recovered: 38, rate: 19.0 },
    ];
}
