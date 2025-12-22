"use client";

import * as React from "react";
import {
    TrendingUp,
    TrendingDown,
    CheckCircle,
    XCircle,
    Clock,
    Activity,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts";
import { getDashboardKPIs, getVerificationTrends, getMethodDistribution, activityFeed } from "@/lib/mock-data";
import { DashboardKPIs } from "@/types";

interface TrendData {
    date: string;
    successful: number;
    failed: number;
}

interface DistributionData {
    name: string;
    value: number;
    fill: string;
}

const chartConfig = {
    successful: {
        label: "Successful",
        color: "var(--primary)",
    },
    failed: {
        label: "Failed",
        color: "var(--destructive)",
    },
} satisfies ChartConfig;

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

function getStatusBadge(type: string) {
    switch (type) {
        case "verification_completed":
            return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Completed</Badge>;
        case "verification_failed":
            return <Badge variant="destructive">Failed</Badge>;
        case "user_registered":
            return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">New User</Badge>;
        case "video_session_started":
            return <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Session Started</Badge>;
        case "video_session_ended":
            return <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">Session Ended</Badge>;
        default:
            return <Badge variant="secondary">Activity</Badge>;
    }
}

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

export default function DashboardPage() {
    const [kpis, setKPIs] = React.useState<DashboardKPIs | null>(null);
    const [trends, setTrends] = React.useState<TrendData[]>([]);
    const [distribution, setDistribution] = React.useState<DistributionData[]>([]);

    React.useEffect(() => {
        setKPIs(getDashboardKPIs());
        setTrends(getVerificationTrends(14));
        setDistribution(getMethodDistribution());
    }, []);

    if (!kpis) {
        return <div className="animate-pulse space-y-4">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back! Here&apos;s an overview of your KYC operations.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Verifications"
                    value={kpis.totalVerifications.value}
                    changePercentage={kpis.totalVerifications.changePercentage}
                    trend={kpis.totalVerifications.trend}
                    icon={Activity}
                />
                <KPICard
                    title="Success Rate"
                    value={kpis.successRate.value}
                    changePercentage={kpis.successRate.changePercentage}
                    trend={kpis.successRate.trend}
                    icon={CheckCircle}
                    suffix="%"
                />
                <KPICard
                    title="Failed Attempts"
                    value={kpis.failedAttempts.value}
                    changePercentage={kpis.failedAttempts.changePercentage}
                    trend={kpis.failedAttempts.trend}
                    icon={XCircle}
                />
                <KPICard
                    title="Avg. Completion Time"
                    value={Math.round(kpis.avgCompletionTime.value / 60)}
                    changePercentage={kpis.avgCompletionTime.changePercentage}
                    trend={kpis.avgCompletionTime.trend}
                    icon={Clock}
                    suffix=" min"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Verification Trends Chart */}
                <Card className="lg:col-span-4">
                    <CardHeader>
                        <CardTitle>Verification Trends</CardTitle>
                        <CardDescription>Daily verifications over the last 14 days</CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                        <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px] w-full">
                            <AreaChart
                                data={trends}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    className="text-xs"
                                    tick={{ fontSize: 10 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis className="text-xs" tick={{ fontSize: 10 }} width={35} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Area
                                    type="monotone"
                                    dataKey="successful"
                                    stackId="1"
                                    stroke="var(--color-successful)"
                                    fill="var(--color-successful)"
                                    fillOpacity={0.6}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="failed"
                                    stackId="1"
                                    stroke="var(--color-failed)"
                                    fill="var(--color-failed)"
                                    fillOpacity={0.6}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Method Distribution Chart */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Verification Methods</CardTitle>
                        <CardDescription>Distribution by KYC type</CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full mx-auto">
                            <PieChart>
                                <Pie
                                    data={distribution}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="40%"
                                    outerRadius="70%"
                                    paddingAngle={2}
                                >
                                    {distribution.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                                <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                        </ChartContainer>
                        <div className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4">
                            {distribution.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs sm:text-sm">
                                    <div
                                        className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.fill }}
                                    />
                                    <span className="text-muted-foreground">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest verifications and system events</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">Time</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {activityFeed.slice(0, 10).map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.message}</TableCell>
                                    <TableCell>{getStatusBadge(item.type)}</TableCell>
                                    <TableCell>{item.user?.name || "System"}</TableCell>
                                    <TableCell className="text-right text-muted-foreground">
                                        {formatTimeAgo(item.timestamp)}
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
