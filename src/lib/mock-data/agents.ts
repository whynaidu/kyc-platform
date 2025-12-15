import { Agent, AgentStatus } from '@/types';
import { agentUsers } from './users';

function generateAgents(): Agent[] {
    const statuses: AgentStatus[] = ['online', 'offline', 'in_call', 'break'];

    return agentUsers.map((user, index) => ({
        id: `agent-profile-${index + 1}`,
        userId: user.id,
        user,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        todayVerifications: Math.floor(Math.random() * 20) + 5,
        weekVerifications: Math.floor(Math.random() * 100) + 30,
        monthVerifications: Math.floor(Math.random() * 400) + 100,
        approvalRate: 75 + Math.random() * 20, // 75-95%
        avgSessionDuration: Math.floor(Math.random() * 300) + 180, // 3-8 minutes
        customerSatisfaction: 3.5 + Math.random() * 1.5, // 3.5-5
        totalSessions: Math.floor(Math.random() * 1000) + 200,
        lastActive: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
    }));
}

export const mockAgents = generateAgents();

export const onlineAgents = mockAgents.filter(a => a.status === 'online' || a.status === 'in_call');
export const offlineAgents = mockAgents.filter(a => a.status === 'offline' || a.status === 'break');

// Get agent by ID
export function getAgentById(id: string): Agent | undefined {
    return mockAgents.find(agent => agent.id === id || agent.userId === id);
}

// Get agent by user ID
export function getAgentByUserId(userId: string): Agent | undefined {
    return mockAgents.find(agent => agent.userId === userId);
}
