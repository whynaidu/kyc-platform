"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowRight } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { KPICard } from "@/components/kpi-card";
import { AgentStatusControl, AgentStatus } from "@/components/agent/status-control";
import { getAgentKPIs, mockQueueItems, mockVideoSessions } from "@/lib/mock-data";
import { AgentKPIs } from "@/types";

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AgentDashboardPage() {
    const router = useRouter();
    const [kpis, setKPIs] = React.useState<AgentKPIs | null>(null);
    const [agentStatus, setAgentStatus] = React.useState<AgentStatus>("offline");

    React.useEffect(() => {
        setKPIs(getAgentKPIs("agent-profile-1"));
        // Load saved status from localStorage
        const savedStatus = localStorage.getItem("agent_status") as AgentStatus;
        if (savedStatus) {
            setAgentStatus(savedStatus);
        }
    }, []);

    const handleStatusChange = (newStatus: AgentStatus) => {
        setAgentStatus(newStatus);
        localStorage.setItem("agent_status", newStatus);
    };

    if (!kpis) {
        return <div className="animate-pulse space-y-4">Loading...</div>;
    }

    const recentSessions = mockVideoSessions.slice(0, 5);

    return (
        <div className="space-y-6">
            {/* Status Control Card */}
            <Card className="border-primary/20 bg-primary/5">
                <CardContent className="py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold">Your Availability</h2>
                                <p className="text-sm text-muted-foreground">
                                    {agentStatus === "online"
                                        ? "You are receiving verification requests"
                                        : agentStatus === "break"
                                        ? "You are on a break - no new requests"
                                        : agentStatus === "in_call"
                                        ? "You are currently on a video call"
                                        : "You are offline - go online to receive requests"
                                    }
                                </p>
                            </div>
                        </div>
                        <AgentStatusControl
                            initialStatus={agentStatus}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Agent Dashboard</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Welcome back! Here&apos;s your performance overview.
                    </p>
                </div>
                <Button onClick={() => router.push("/agent/queue")}>
                    View Queue
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Today's Verifications"
                    value={kpis.todayVerifications.value}
                    badge={`${kpis.todayVerifications.changePercentage > 0 ? "+" : ""}${kpis.todayVerifications.changePercentage}%`}
                    badgeVariant={kpis.todayVerifications.trend === "up" ? "success" : "danger"}
                    trend={kpis.todayVerifications.trend}
                    description={kpis.todayVerifications.trend === "up" ? "Great productivity" : "Below average"}
                    subtitle="Compared to yesterday"
                />
                <KPICard
                    title="Approval Rate"
                    value={kpis.approvalRate.value}
                    badge={`${kpis.approvalRate.changePercentage > 0 ? "+" : ""}${kpis.approvalRate.changePercentage}%`}
                    badgeVariant={kpis.approvalRate.trend === "up" ? "success" : "danger"}
                    trend={kpis.approvalRate.trend}
                    suffix="%"
                    description={kpis.approvalRate.trend === "up" ? "Above team average" : "Below team average"}
                    subtitle="Team avg: 85%"
                />
                <KPICard
                    title="Avg. Session Duration"
                    value={Math.round(kpis.avgSessionDuration.value / 60)}
                    badge={`${kpis.avgSessionDuration.changePercentage > 0 ? "+" : ""}${kpis.avgSessionDuration.changePercentage}%`}
                    badgeVariant={kpis.avgSessionDuration.trend === "down" ? "success" : "danger"}
                    trend={kpis.avgSessionDuration.trend}
                    suffix=" min"
                    description={kpis.avgSessionDuration.trend === "down" ? "Efficient processing" : "Taking longer"}
                    subtitle="Per session"
                />
                <KPICard
                    title="Customer Satisfaction"
                    value={kpis.customerSatisfaction.value}
                    badge={`${kpis.customerSatisfaction.changePercentage > 0 ? "+" : ""}${kpis.customerSatisfaction.changePercentage}%`}
                    badgeVariant={kpis.customerSatisfaction.trend === "up" ? "success" : "danger"}
                    trend={kpis.customerSatisfaction.trend}
                    suffix="/5"
                    description={kpis.customerSatisfaction.trend === "up" ? "Excellent feedback" : "Needs improvement"}
                    subtitle="Based on reviews"
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Queue Preview */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Current Queue</CardTitle>
                            <CardDescription>{mockQueueItems.length} pending verifications</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push("/agent/queue")}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {mockQueueItems.slice(0, 3).map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{item.user.name}</p>
                                            <p className="text-sm text-muted-foreground capitalize">
                                                {item.kycType.replace("_", " ")}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant={item.priority === "high" ? "destructive" : item.priority === "medium" ? "default" : "secondary"}
                                        >
                                            {item.priority}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">{item.waitTime} min wait</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Sessions */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Recent Sessions</CardTitle>
                            <CardDescription>Your latest verification sessions</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => router.push("/agent/performance")}>
                            View All
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead>Outcome</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentSessions.filter(s => s.status === "completed").slice(0, 5).map((session) => (
                                    <TableRow key={session.id}>
                                        <TableCell className="font-medium">{session.user.name}</TableCell>
                                        <TableCell>{session.duration ? formatDuration(session.duration) : "-"}</TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    session.outcome === "approved"
                                                        ? "bg-green-500/10 text-green-500"
                                                        : session.outcome === "rejected"
                                                            ? "bg-red-500/10 text-red-500"
                                                            : "bg-yellow-500/10 text-yellow-500"
                                                }
                                            >
                                                {session.outcome}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
