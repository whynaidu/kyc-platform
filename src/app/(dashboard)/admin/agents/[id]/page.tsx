"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { mockAgents, getSessionsByAgentId, dailyMetrics } from "@/lib/mock-data";
import { Agent, AgentStatus } from "@/types";

const chartConfig = {
    verifications: {
        label: "Verifications",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

function getStatusBadge(status: AgentStatus) {
    switch (status) {
        case "online":
            return <Badge className="bg-green-500/10 text-green-500">Online</Badge>;
        case "in_call":
            return <Badge className="bg-blue-500/10 text-blue-500">In Call</Badge>;
        case "break":
            return <Badge className="bg-yellow-500/10 text-yellow-500">Break</Badge>;
        default:
            return <Badge variant="secondary">Offline</Badge>;
    }
}

export default function AgentDetailPage() {
    const router = useRouter();
    const params = useParams();
    const [agent, setAgent] = React.useState<Agent | null>(null);

    React.useEffect(() => {
        const foundAgent = mockAgents.find(a => a.id === params.id);
        setAgent(foundAgent || null);
    }, [params.id]);

    if (!agent) {
        return <div>Agent not found</div>;
    }

    const sessions = getSessionsByAgentId(agent.id).slice(0, 10);
    const chartData = dailyMetrics.slice(-7).map(m => ({
        date: m.date,
        verifications: Math.floor(m.totalVerifications / mockAgents.length),
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/admin/agents")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Agent Details</h1>
                    <p className="text-muted-foreground">View agent profile and performance</p>
                </div>
            </div>

            {/* Agent Profile Header */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={agent.user.avatar} alt={agent.user.name} />
                            <AvatarFallback className="text-2xl">
                                {agent.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h2 className="text-2xl font-bold">{agent.user.name}</h2>
                                {getStatusBadge(agent.status)}
                            </div>
                            <p className="text-muted-foreground">{agent.user.email}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                <span className="font-medium">{agent.customerSatisfaction.toFixed(1)}</span>
                                <span className="text-muted-foreground text-sm">/ 5.0</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold">{agent.totalSessions}</p>
                            <p className="text-sm text-muted-foreground">Total Sessions</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{agent.todayVerifications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{agent.weekVerifications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{agent.approvalRate.toFixed(1)}%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{Math.round(agent.avgSessionDuration / 60)} min</p>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Performance</CardTitle>
                    <CardDescription>Verifications over the last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="h-[250px] w-full">
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { weekday: "short" })}
                                className="text-xs"
                            />
                            <YAxis className="text-xs" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="verifications" fill="hsl(var(--primary))" radius={4} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Session History */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Sessions</CardTitle>
                    <CardDescription>Last 10 verification sessions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Outcome</TableHead>
                                <TableHead className="text-right">Duration</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sessions.map((session) => (
                                <TableRow key={session.id}>
                                    <TableCell className="font-medium">{session.user.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="capitalize">{session.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        {session.outcome && (
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
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {session.duration ? `${Math.round(session.duration / 60)} min` : "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
