import { KYCRecord, KYCType, VerificationStatus, QueueItem, Priority, VideoSession, VideoSessionStatus } from '@/types';
import { regularUsers, mockUsers } from './users';
import { mockAgents } from './agents';

// Generate 100+ KYC records
function generateKYCRecords(): KYCRecord[] {
    const types: KYCType[] = ['face_liveness', 'face_match', 'handwriting', 'location', 'video_kyc'];
    const statuses: VerificationStatus[] = ['pending', 'verified', 'failed', 'in_progress'];

    const records: KYCRecord[] = [];

    for (let i = 0; i < 120; i++) {
        const user = regularUsers[i % regularUsers.length];
        const type = types[Math.floor(Math.random() * types.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);

        records.push({
            id: `kyc-${i + 1}`,
            userId: user.id,
            user,
            type,
            status,
            agentId: status === 'verified' || status === 'failed' ? mockAgents[Math.floor(Math.random() * mockAgents.length)]?.id : undefined,
            confidence: status === 'verified' ? 85 + Math.random() * 15 : status === 'failed' ? Math.random() * 50 : undefined,
            createdAt,
            completedAt: status === 'verified' || status === 'failed' ? new Date(createdAt.getTime() + Math.random() * 10 * 60 * 1000) : undefined,
            metadata: {
                device: ['iPhone', 'Android', 'Desktop'][Math.floor(Math.random() * 3)],
                browser: ['Chrome', 'Safari', 'Firefox'][Math.floor(Math.random() * 3)],
            },
        });
    }

    return records.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export const mockKYCRecords = generateKYCRecords();

export const pendingRecords = mockKYCRecords.filter(r => r.status === 'pending');
export const verifiedRecords = mockKYCRecords.filter(r => r.status === 'verified');
export const failedRecords = mockKYCRecords.filter(r => r.status === 'failed');

// Generate queue items
function generateQueueItems(): QueueItem[] {
    const priorities: Priority[] = ['high', 'medium', 'normal'];
    const types: KYCType[] = ['face_liveness', 'face_match', 'handwriting', 'location', 'video_kyc'];
    const documents = ['passport.jpg', 'drivers_license.jpg', 'selfie.jpg', 'handwriting.jpg', 'national_id.jpg'];

    return pendingRecords.slice(0, 15).map((record, index) => ({
        id: `queue-${index + 1}`,
        userId: record.userId,
        user: record.user,
        kycType: types[Math.floor(Math.random() * types.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        waitTime: Math.floor(Math.random() * 30) + 1,
        documents: documents.slice(0, Math.floor(Math.random() * 3) + 1),
        createdAt: new Date(Date.now() - Math.random() * 60 * 60 * 1000),
    }));
}

export const mockQueueItems = generateQueueItems();

// Generate video sessions
function generateVideoSessions(): VideoSession[] {
    const statuses: VideoSessionStatus[] = ['waiting', 'in_progress', 'completed', 'cancelled'];
    const outcomes: ('approved' | 'rejected' | 'escalated')[] = ['approved', 'rejected', 'escalated'];

    const sessions: VideoSession[] = [];

    for (let i = 0; i < 50; i++) {
        const user = regularUsers[i % regularUsers.length];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const agent = mockAgents[Math.floor(Math.random() * mockAgents.length)];
        const startTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

        sessions.push({
            id: `video-session-${i + 1}`,
            userId: user.id,
            user,
            agentId: status !== 'waiting' ? agent.id : undefined,
            agent: status !== 'waiting' ? agent : undefined,
            status,
            queuePosition: status === 'waiting' ? Math.floor(Math.random() * 10) + 1 : undefined,
            startTime: status !== 'waiting' ? startTime : undefined,
            endTime: status === 'completed' || status === 'cancelled' ? new Date(startTime.getTime() + Math.random() * 15 * 60 * 1000) : undefined,
            duration: status === 'completed' ? Math.floor(Math.random() * 600) + 180 : undefined,
            outcome: status === 'completed' ? outcomes[Math.floor(Math.random() * 3)] : undefined,
            rejectionReason: status === 'completed' && Math.random() > 0.7 ? 'Document expired' : undefined,
            agentNotes: status === 'completed' ? 'Verification completed successfully.' : undefined,
        });
    }

    return sessions.sort((a, b) => (b.startTime?.getTime() || 0) - (a.startTime?.getTime() || 0));
}

export const mockVideoSessions = generateVideoSessions();

// Get records by user
export function getRecordsByUserId(userId: string): KYCRecord[] {
    return mockKYCRecords.filter(record => record.userId === userId);
}

// Get sessions by agent
export function getSessionsByAgentId(agentId: string): VideoSession[] {
    return mockVideoSessions.filter(session => session.agentId === agentId);
}
