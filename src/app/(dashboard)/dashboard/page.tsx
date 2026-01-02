"use client";

import * as React from "react";
import Link from "next/link";
import { Smartphone, UserPlus2, AlertTriangle, TrendingDown, ArrowRight } from "lucide-react";

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
import { KPICard } from "@/components/kpi-card";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell } from "recharts";
import {
    getDashboardKPIs,
    getVerificationTrends,
    getMethodDistribution,
    activityFeed,
    getDeviceKPIs,
    getOnboardingKPIs,
    getKYCFailureKPIs,
    getOnboardingFailureKPIs,
} from "@/lib/mock-data";
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

    // Analytics data
    const deviceKPIs = getDeviceKPIs();
    const onboardingKPIs = getOnboardingKPIs();
    const kycFailureKPIs = getKYCFailureKPIs();
    const onboardingFailureKPIs = getOnboardingFailureKPIs();

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
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground">
                    Welcome back! Here&apos;s an overview of your KYC operations.
                </p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Verifications"
                    value={kpis.totalVerifications.value}
                    badge={`${kpis.totalVerifications.changePercentage > 0 ? "+" : ""}${kpis.totalVerifications.changePercentage}%`}
                    badgeVariant={kpis.totalVerifications.trend === "up" ? "success" : "danger"}
                    trend={kpis.totalVerifications.trend}
                    description={kpis.totalVerifications.trend === "up" ? "Strong verification volume" : "Volume needs attention"}
                    subtitle="Compared to yesterday"
                />
                <KPICard
                    title="Success Rate"
                    value={kpis.successRate.value}
                    badge={`${kpis.successRate.changePercentage > 0 ? "+" : ""}${kpis.successRate.changePercentage}%`}
                    badgeVariant={kpis.successRate.trend === "up" ? "success" : "danger"}
                    trend={kpis.successRate.trend}
                    suffix="%"
                    description={kpis.successRate.trend === "up" ? "Above target threshold" : "Below target threshold"}
                    subtitle="Target: 95%"
                />
                <KPICard
                    title="Failed Attempts"
                    value={kpis.failedAttempts.value}
                    badge={`${kpis.failedAttempts.changePercentage > 0 ? "+" : ""}${kpis.failedAttempts.changePercentage}%`}
                    badgeVariant={kpis.failedAttempts.trend === "down" ? "success" : "danger"}
                    trend={kpis.failedAttempts.trend}
                    description={kpis.failedAttempts.trend === "down" ? "Failures decreasing" : "Requires investigation"}
                    subtitle="Review flagged cases"
                />
                <KPICard
                    title="Avg. Completion Time"
                    value={Math.round(kpis.avgCompletionTime.value / 60)}
                    badge={`${kpis.avgCompletionTime.changePercentage > 0 ? "+" : ""}${kpis.avgCompletionTime.changePercentage}%`}
                    badgeVariant={kpis.avgCompletionTime.trend === "down" ? "success" : "danger"}
                    trend={kpis.avgCompletionTime.trend}
                    suffix=" min"
                    description={kpis.avgCompletionTime.trend === "down" ? "Processing faster" : "Processing slower"}
                    subtitle="Per verification"
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
                                <defs>
                                    <linearGradient id="successfulGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--color-successful)" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="var(--color-successful)" stopOpacity={0.05} />
                                    </linearGradient>
                                    <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--color-failed)" stopOpacity={0.5} />
                                        <stop offset="100%" stopColor="var(--color-failed)" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
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
                                    strokeWidth={2}
                                    fill="url(#successfulGradient)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="failed"
                                    stackId="1"
                                    stroke="var(--color-failed)"
                                    strokeWidth={2}
                                    fill="url(#failedGradient)"
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

            {/* Quick Insights */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/analytics/device" className="group">
                    <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                                        <Smartphone className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Mobile Usage</p>
                                        <p className="text-2xl font-bold">{deviceKPIs.mobileShare.value}%</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                {deviceKPIs.avgSuccessRate.value}% success rate across devices
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/analytics/onboarding" className="group">
                    <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                                        <UserPlus2 className="h-5 w-5 text-green-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Onboarding</p>
                                        <p className="text-2xl font-bold">{onboardingKPIs.conversionRate.value}%</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Conversion rate • {onboardingKPIs.avgCompletionTime.value} min avg
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/analytics/kyc-failures" className="group">
                    <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                                        <AlertTriangle className="h-5 w-5 text-red-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">KYC Failures</p>
                                        <p className="text-2xl font-bold">{kycFailureKPIs.totalFailures.value.toLocaleString()}</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Top: {kycFailureKPIs.highestFailureStep.step} ({kycFailureKPIs.highestFailureStep.rate}%)
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/analytics/onboarding-failures" className="group">
                    <Card className="h-full transition-colors hover:bg-muted/50">
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                                        <TrendingDown className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Drop-offs</p>
                                        <p className="text-2xl font-bold">{onboardingFailureKPIs.totalDropoffs.value.toLocaleString()}</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground">
                                Top: {onboardingFailureKPIs.highestDropoffStep.step} ({onboardingFailureKPIs.highestDropoffStep.rate}%)
                            </p>
                        </CardContent>
                    </Card>
                </Link>
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
