"use client";

import * as React from "react";
import {
    TrendingUp,
    Activity,
    AlertCircle,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { KPICard } from "@/components/kpi-card";
import { getAdminKPIs, activityFeed, mockAgents } from "@/lib/mock-data";
import { AdminKPIs } from "@/types";

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

function getActivityIcon(type: string) {
    switch (type) {
        case "verification_completed":
            return <div className="h-2 w-2 rounded-full bg-green-500" />;
        case "verification_failed":
            return <div className="h-2 w-2 rounded-full bg-red-500" />;
        case "user_registered":
            return <div className="h-2 w-2 rounded-full bg-blue-500" />;
        default:
            return <div className="h-2 w-2 rounded-full bg-gray-500" />;
    }
}

export default function AdminDashboardPage() {
    const [kpis, setKPIs] = React.useState<AdminKPIs | null>(null);

    React.useEffect(() => {
        setKPIs(getAdminKPIs());
    }, []);

    if (!kpis) {
        return <div className="animate-pulse space-y-4">Loading...</div>;
    }

    const onlineAgentsCount = mockAgents.filter(a => a.status === "online" || a.status === "in_call").length;
    const offlineAgentsCount = mockAgents.length - onlineAgentsCount;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    System overview and real-time monitoring.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Users"
                    value={kpis.totalUsers.value}
                    badge={`${kpis.totalUsers.changePercentage > 0 ? "+" : ""}${kpis.totalUsers.changePercentage}%`}
                    badgeVariant={kpis.totalUsers.trend === "up" ? "success" : "danger"}
                    trend={kpis.totalUsers.trend}
                    description={kpis.totalUsers.trend === "up" ? "User growth" : "Users declining"}
                    subtitle="Registered accounts"
                />
                <KPICard
                    title="Active Agents"
                    value={kpis.activeAgents.value}
                    badge={`${kpis.activeAgents.changePercentage > 0 ? "+" : ""}${kpis.activeAgents.changePercentage}%`}
                    badgeVariant={kpis.activeAgents.trend === "up" ? "success" : "danger"}
                    trend={kpis.activeAgents.trend}
                    description={`${onlineAgentsCount} online, ${offlineAgentsCount} offline`}
                    subtitle="Currently available"
                />
                <KPICard
                    title="Queue Length"
                    value={kpis.currentQueueLength.value}
                    badge={`${kpis.currentQueueLength.changePercentage > 0 ? "+" : ""}${kpis.currentQueueLength.changePercentage}%`}
                    badgeVariant={kpis.currentQueueLength.trend === "down" ? "success" : "warning"}
                    trend={kpis.currentQueueLength.trend}
                    description={kpis.currentQueueLength.trend === "down" ? "Queue clearing" : "Queue building up"}
                    subtitle="Pending verifications"
                />
                <KPICard
                    title="System Health"
                    value={kpis.systemHealth.value}
                    suffix="%"
                    badge={kpis.systemHealth.value >= 95 ? "Healthy" : "Degraded"}
                    badgeVariant={kpis.systemHealth.value >= 95 ? "success" : "warning"}
                    trend={kpis.systemHealth.trend}
                    description="All systems operational"
                    subtitle="Uptime this month"
                />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                {/* Activity Feed */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Real-time Activity</CardTitle>
                        <CardDescription>Latest system events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-80">
                            <div className="space-y-4">
                                {activityFeed.map((item) => (
                                    <div key={item.id} className="flex items-start gap-3">
                                        <div className="mt-1.5">{getActivityIcon(item.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm">{item.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatTimeAgo(item.timestamp)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* System Alerts */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>System Alerts</CardTitle>
                        <CardDescription>Important notifications</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <Activity className="h-5 w-5 text-green-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-green-500">All Systems Operational</p>
                                    <p className="text-xs text-muted-foreground">Last checked 2 minutes ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-500">High Queue Volume</p>
                                    <p className="text-xs text-muted-foreground">15 verifications pending, consider adding more agents</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-500">Peak Hours Approaching</p>
                                    <p className="text-xs text-muted-foreground">Verification volume typically increases between 2-5 PM</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Agent Status Overview */}
            <Card>
                <CardHeader>
                    <CardTitle>Agent Status</CardTitle>
                    <CardDescription>Current agent availability</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                            <div className="h-3 w-3 rounded-full bg-green-500" />
                            <div>
                                <p className="text-2xl font-bold">{mockAgents.filter(a => a.status === "online").length}</p>
                                <p className="text-sm text-muted-foreground">Online</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <div>
                                <p className="text-2xl font-bold">{mockAgents.filter(a => a.status === "in_call").length}</p>
                                <p className="text-sm text-muted-foreground">In Call</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                            <div className="h-3 w-3 rounded-full bg-yellow-500" />
                            <div>
                                <p className="text-2xl font-bold">{mockAgents.filter(a => a.status === "break").length}</p>
                                <p className="text-sm text-muted-foreground">On Break</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-muted">
                            <div className="h-3 w-3 rounded-full bg-gray-500" />
                            <div>
                                <p className="text-2xl font-bold">{mockAgents.filter(a => a.status === "offline").length}</p>
                                <p className="text-sm text-muted-foreground">Offline</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
