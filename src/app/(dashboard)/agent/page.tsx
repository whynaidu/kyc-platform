"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Clock,
    Star,
    Users,
    ArrowRight,
} from "lucide-react";

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
import { getAgentKPIs, mockQueueItems, mockVideoSessions } from "@/lib/mock-data";
import { AgentKPIs } from "@/types";

function KPICard({
    title,
    value,
    changePercentage,
    trend,
    icon: Icon,
    suffix = "",
}: {
    title: string;
    value: number;
    changePercentage: number;
    trend: "up" | "down" | "neutral";
    icon: React.ComponentType<{ className?: string }>;
    suffix?: string;
}) {
    const isPositive = trend === "up";

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {typeof value === "number" && value % 1 !== 0 ? value.toFixed(1) : value}{suffix}
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                    {isPositive ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                    ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                    )}
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
                        {changePercentage > 0 ? "+" : ""}{changePercentage}%
                    </span>
                    <span className="ml-1">from yesterday</span>
                </div>
            </CardContent>
        </Card>
    );
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function AgentDashboardPage() {
    const router = useRouter();
    const [kpis, setKPIs] = React.useState<AgentKPIs | null>(null);

    React.useEffect(() => {
        setKPIs(getAgentKPIs("agent-profile-1"));
    }, []);

    if (!kpis) {
        return <div className="animate-pulse space-y-4">Loading...</div>;
    }

    const recentSessions = mockVideoSessions.slice(0, 5);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agent Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here&apos;s your performance overview.
                    </p>
                </div>
                <Button onClick={() => router.push("/agent/queue")}>
                    View Queue
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Today's Verifications"
                    value={kpis.todayVerifications.value}
                    changePercentage={kpis.todayVerifications.changePercentage}
                    trend={kpis.todayVerifications.trend}
                    icon={CheckCircle}
                />
                <KPICard
                    title="Approval Rate"
                    value={kpis.approvalRate.value}
                    changePercentage={kpis.approvalRate.changePercentage}
                    trend={kpis.approvalRate.trend}
                    icon={TrendingUp}
                    suffix="%"
                />
                <KPICard
                    title="Avg. Session Duration"
                    value={Math.round(kpis.avgSessionDuration.value / 60)}
                    changePercentage={kpis.avgSessionDuration.changePercentage}
                    trend={kpis.avgSessionDuration.trend}
                    icon={Clock}
                    suffix=" min"
                />
                <KPICard
                    title="Customer Satisfaction"
                    value={kpis.customerSatisfaction.value}
                    changePercentage={kpis.customerSatisfaction.changePercentage}
                    trend={kpis.customerSatisfaction.trend}
                    icon={Star}
                    suffix="/5"
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
