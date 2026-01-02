import { KYCStepFailure, KYCFailureTimePattern, KYCRetryPattern, KYCFailureKPIs } from '@/types';

// KYC step failure breakdown
export const kycStepFailures: KYCStepFailure[] = [
    {
        step: 'face_liveness',
        label: 'Face Liveness',
        totalAttempts: 25000,
        failures: 2250,
        failureRate: 9.0,
        topReasons: [
            { reason: 'Multiple faces detected', count: 680, percentage: 30.2 },
            { reason: 'Poor lighting conditions', count: 540, percentage: 24.0 },
            { reason: 'Face not centered', count: 450, percentage: 20.0 },
            { reason: 'Blink not detected', count: 380, percentage: 16.9 },
            { reason: 'Glasses/mask interference', count: 200, percentage: 8.9 },
        ],
    },
    {
        step: 'face_match',
        label: 'Face Match',
        totalAttempts: 22750,
        failures: 1820,
        failureRate: 8.0,
        topReasons: [
            { reason: 'Low similarity score', count: 728, percentage: 40.0 },
            { reason: 'Document photo quality', count: 455, percentage: 25.0 },
            { reason: 'Significant appearance change', count: 364, percentage: 20.0 },
            { reason: 'Camera angle mismatch', count: 182, percentage: 10.0 },
            { reason: 'Lighting inconsistency', count: 91, percentage: 5.0 },
        ],
    },
    {
        step: 'handwriting',
        label: 'Handwriting Verification',
        totalAttempts: 20930,
        failures: 1465,
        failureRate: 7.0,
        topReasons: [
            { reason: 'Illegible handwriting', count: 513, percentage: 35.0 },
            { reason: 'Signature mismatch', count: 381, percentage: 26.0 },
            { reason: 'Incomplete sample', count: 293, percentage: 20.0 },
            { reason: 'Wrong text written', count: 176, percentage: 12.0 },
            { reason: 'Image blur', count: 102, percentage: 7.0 },
        ],
    },
    {
        step: 'location',
        label: 'Location Verification',
        totalAttempts: 19465,
        failures: 584,
        failureRate: 3.0,
        topReasons: [
            { reason: 'GPS permission denied', count: 234, percentage: 40.0 },
            { reason: 'Location spoofing detected', count: 146, percentage: 25.0 },
            { reason: 'Restricted zone', count: 88, percentage: 15.0 },
            { reason: 'Unstable signal', count: 70, percentage: 12.0 },
            { reason: 'VPN/proxy detected', count: 46, percentage: 8.0 },
        ],
    },
    {
        step: 'video_kyc',
        label: 'Video KYC',
        totalAttempts: 18881,
        failures: 2454,
        failureRate: 13.0,
        topReasons: [
            { reason: 'Poor network quality', count: 736, percentage: 30.0 },
            { reason: 'User disconnect', count: 491, percentage: 20.0 },
            { reason: 'Audio/video issues', count: 442, percentage: 18.0 },
            { reason: 'Document not visible', count: 368, percentage: 15.0 },
            { reason: 'Agent unavailable', count: 245, percentage: 10.0 },
            { reason: 'Timeout exceeded', count: 172, percentage: 7.0 },
        ],
    },
];

// Time pattern of failures (by hour)
export const failureTimePatterns: KYCFailureTimePattern[] = [
    { hour: 0, failures: 45, total: 420 },
    { hour: 1, failures: 32, total: 310 },
    { hour: 2, failures: 28, total: 250 },
    { hour: 3, failures: 22, total: 200 },
    { hour: 4, failures: 18, total: 180 },
    { hour: 5, failures: 25, total: 280 },
    { hour: 6, failures: 65, total: 620 },
    { hour: 7, failures: 125, total: 1180 },
    { hour: 8, failures: 185, total: 1850 },
    { hour: 9, failures: 245, total: 2380 },
    { hour: 10, failures: 310, total: 2950 },
    { hour: 11, failures: 340, total: 3250 },
    { hour: 12, failures: 280, total: 2680 },
    { hour: 13, failures: 295, total: 2820 },
    { hour: 14, failures: 320, total: 3050 },
    { hour: 15, failures: 350, total: 3320 },
    { hour: 16, failures: 365, total: 3480 },
    { hour: 17, failures: 340, total: 3250 },
    { hour: 18, failures: 285, total: 2720 },
    { hour: 19, failures: 220, total: 2100 },
    { hour: 20, failures: 165, total: 1580 },
    { hour: 21, failures: 125, total: 1200 },
    { hour: 22, failures: 85, total: 820 },
    { hour: 23, failures: 58, total: 560 },
];

// Retry patterns
export const retryPatterns: KYCRetryPattern[] = [
    { attempts: 1, count: 18500, eventualSuccessRate: 0 },
    { attempts: 2, count: 4800, eventualSuccessRate: 72.5 },
    { attempts: 3, count: 1920, eventualSuccessRate: 58.3 },
    { attempts: 4, count: 580, eventualSuccessRate: 45.0 },
    { attempts: 5, count: 200, eventualSuccessRate: 32.0 },
];

// Daily failure trends
export function getFailureTrends(days: number = 14) {
    const trends = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        trends.push({
            date: date.toISOString().split('T')[0],
            face_liveness: Math.floor(140 + Math.random() * 60),
            face_match: Math.floor(110 + Math.random() * 50),
            handwriting: Math.floor(85 + Math.random() * 40),
            location: Math.floor(35 + Math.random() * 20),
            video_kyc: Math.floor(150 + Math.random() * 70),
        });
    }

    return trends;
}

// KPI calculations
export function getKYCFailureKPIs(): KYCFailureKPIs {
    const totalFailures = kycStepFailures.reduce((sum, s) => sum + s.failures, 0);

    // Find highest failure step
    const highestStep = kycStepFailures.reduce((max, s) =>
        s.failureRate > max.failureRate ? s : max
    );

    // Find peak failure hour
    const peakHour = failureTimePatterns.reduce((max, p) =>
        p.failures > max.failures ? p : max
    );

    // Calculate retry success rate
    const retriedAttempts = retryPatterns.slice(1).reduce((sum, p) => sum + p.count, 0);
    const successfulRetries = retryPatterns.slice(1).reduce(
        (sum, p) => sum + (p.count * p.eventualSuccessRate / 100), 0
    );

    return {
        totalFailures: {
            value: totalFailures,
            previousValue: 9250,
            changePercentage: -7.8,
            trend: 'down',
        },
        highestFailureStep: {
            step: highestStep.label,
            rate: highestStep.failureRate,
        },
        retrySuccessRate: {
            value: Math.round((successfulRetries / retriedAttempts) * 1000) / 10,
            previousValue: 62.5,
            changePercentage: 3.2,
            trend: 'up',
        },
        peakFailureHour: peakHour.hour,
    };
}

// Failure heatmap by day and hour
export function getFailureHeatmap() {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const heatmap: { day: string; hour: number; failures: number }[] = [];

    days.forEach((day, dayIndex) => {
        for (let hour = 0; hour < 24; hour++) {
            // Higher failures during business hours, lower on weekends
            const baseFailures = failureTimePatterns[hour].failures;
            const dayMultiplier = dayIndex < 5 ? 1.0 : 0.6;
            const variance = 0.8 + Math.random() * 0.4;

            heatmap.push({
                day,
                hour,
                failures: Math.floor(baseFailures * dayMultiplier * variance / 7),
            });
        }
    });

    return heatmap;
}
