"use client";

import * as React from "react";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { KPICard } from "@/components/kpi-card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";

import {
    kycStepFailures,
    failureTimePatterns,
    retryPatterns,
    getKYCFailureKPIs,
    getFailureTrends,
} from "@/lib/mock-data";

const chartConfig = {
    failures: {
        label: "Failures",
        color: "var(--destructive)",
    },
    total: {
        label: "Total",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

const STEP_COLORS = {
    face_liveness: "var(--chart-1)",
    face_match: "var(--chart-2)",
    handwriting: "var(--chart-3)",
    location: "var(--chart-4)",
    video_kyc: "var(--chart-5)",
};

export default function KYCFailuresPage() {
    const [stepFilter, setStepFilter] = React.useState<string>("all");

    const kpis = getKYCFailureKPIs();
    const trends = getFailureTrends(14);

    const filteredStepFailures = React.useMemo(() => {
        if (stepFilter === "all") return kycStepFailures;
        return kycStepFailures.filter(s => s.step === stepFilter);
    }, [stepFilter]);

    // Failure rate bar data
    const failureRateData = kycStepFailures.map(s => ({
        step: s.label,
        failureRate: s.failureRate,
        failures: s.failures,
        fill: STEP_COLORS[s.step as keyof typeof STEP_COLORS],
    }));

    // Hourly pattern data
    const hourlyData = failureTimePatterns.map(p => ({
        hour: `${p.hour.toString().padStart(2, '0')}:00`,
        failures: p.failures,
        total: p.total,
        failureRate: ((p.failures / p.total) * 100).toFixed(1),
    }));

    // Format hour for display
    const formatHour = (hour: number) => {
        if (hour === 0) return "12 AM";
        if (hour === 12) return "12 PM";
        if (hour < 12) return `${hour} AM`;
        return `${hour - 12} PM`;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">KYC Failure Analytics</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Identify where and why KYC verifications fail.
                    </p>
                </div>
                <Select value={stepFilter} onValueChange={setStepFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by Step" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Steps</SelectItem>
                        <SelectItem value="face_liveness">Face Liveness</SelectItem>
                        <SelectItem value="face_match">Face Match</SelectItem>
                        <SelectItem value="handwriting">Handwriting</SelectItem>
                        <SelectItem value="location">Location</SelectItem>
                        <SelectItem value="video_kyc">Video KYC</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Failures"
                    value={kpis.totalFailures.value}
                    badge={`${kpis.totalFailures.changePercentage}%`}
                    badgeVariant="success"
                    trend="down"
                    description="This month"
                    subtitle="Decreasing trend"
                />
                <KPICard
                    title="Highest Failure Step"
                    value={kpis.highestFailureStep.step}
                    badge={`${kpis.highestFailureStep.rate}%`}
                    badgeVariant="danger"
                    description="Needs attention"
                    subtitle="Most problematic step"
                />
                <KPICard
                    title="Retry Success Rate"
                    value={kpis.retrySuccessRate.value}
                    suffix="%"
                    badge={`+${kpis.retrySuccessRate.changePercentage}%`}
                    badgeVariant="success"
                    trend="up"
                    description="Users who retry"
                    subtitle="Eventually succeed"
                />
                <KPICard
                    title="Peak Failure Hour"
                    value={formatHour(kpis.peakFailureHour)}
                    badge="High Traffic"
                    badgeVariant="warning"
                    description="Most failures occur"
                    subtitle="Consider scaling"
                />
            </div>

            <Tabs defaultValue="by-step" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="by-step">By Step</TabsTrigger>
                    <TabsTrigger value="reasons">Reasons</TabsTrigger>
                    <TabsTrigger value="timing">Timing</TabsTrigger>
                    <TabsTrigger value="retries">Retries</TabsTrigger>
                </TabsList>

                {/* By Step Tab */}
                <TabsContent value="by-step" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Failure Rate by Step</CardTitle>
                                <CardDescription>Which steps have the highest failure rates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                    <BarChart data={failureRateData} layout="vertical" barCategoryGap="16%">
                                        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" domain={[0, 15]} tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="step"
                                            type="category"
                                            width={100}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="failureRate" fill="var(--destructive)" radius={[0, 4, 4, 0]} maxBarSize={24} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Failure Trends</CardTitle>
                                <CardDescription>Daily failures by step (last 14 days)</CardDescription>
                            </CardHeader>
                            <CardContent className="px-2 sm:px-6">
                                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                    <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="failuresGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0.05} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="date"
                                            tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                            tick={{ fontSize: 10 }}
                                            tickLine={false}
                                            axisLine={false}
                                            interval="preserveStartEnd"
                                        />
                                        <YAxis tick={{ fontSize: 10 }} width={35} tickLine={false} axisLine={false} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Area
                                            type="monotone"
                                            dataKey="video_kyc"
                                            stackId="1"
                                            stroke="var(--chart-5)"
                                            fill="var(--chart-5)"
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="face_liveness"
                                            stackId="1"
                                            stroke="var(--chart-1)"
                                            fill="var(--chart-1)"
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="face_match"
                                            stackId="1"
                                            stroke="var(--chart-2)"
                                            fill="var(--chart-2)"
                                            fillOpacity={0.6}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Step Failure Details</CardTitle>
                            <CardDescription>Detailed breakdown by verification step</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Step</TableHead>
                                        <TableHead className="text-right">Attempts</TableHead>
                                        <TableHead className="text-right">Failures</TableHead>
                                        <TableHead className="text-right">Failure Rate</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStepFailures.map((step) => (
                                        <TableRow key={step.step}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: STEP_COLORS[step.step as keyof typeof STEP_COLORS] }}
                                                    />
                                                    <span className="font-medium">{step.label}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{step.totalAttempts.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{step.failures.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={step.failureRate > 10 ? "text-red-500" : step.failureRate > 7 ? "text-yellow-500" : "text-green-500"}>
                                                    {step.failureRate}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={step.failureRate > 10 ? "destructive" : "default"}
                                                    className={step.failureRate <= 7 ? "bg-green-500/10 text-green-500" : ""}
                                                >
                                                    {step.failureRate > 10 ? "Critical" : step.failureRate > 7 ? "Warning" : "Normal"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reasons Tab */}
                <TabsContent value="reasons" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredStepFailures.map((step) => (
                            <Card key={step.step}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{step.label}</CardTitle>
                                        <Badge variant="outline">{step.failureRate}% failure</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {step.topReasons.map((reason, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground truncate pr-2">{reason.reason}</span>
                                                    <span className="font-medium shrink-0">{reason.percentage}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-destructive/70 transition-all"
                                                        style={{ width: `${reason.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Timing Tab */}
                <TabsContent value="timing" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Failures by Hour</CardTitle>
                            <CardDescription>When do most failures occur during the day</CardDescription>
                        </CardHeader>
                        <CardContent className="px-2 sm:px-6">
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <BarChart data={hourlyData} barCategoryGap="8%">
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="hour"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 9 }}
                                        interval={2}
                                    />
                                    <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 10 }} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="failures" fill="var(--destructive)" radius={[4, 4, 0, 0]} maxBarSize={20} />
                                </BarChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Peak Hours Analysis</CardTitle>
                            <CardDescription>Hours with highest failure counts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {failureTimePatterns
                                    .sort((a, b) => b.failures - a.failures)
                                    .slice(0, 4)
                                    .map((pattern, idx) => (
                                        <div key={pattern.hour} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                                                <Clock className="h-5 w-5 text-destructive" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{formatHour(pattern.hour)}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {pattern.failures} failures ({((pattern.failures / pattern.total) * 100).toFixed(1)}%)
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Retries Tab */}
                <TabsContent value="retries" className="space-y-4">
                    {/* Compact Stats Row */}
                    <Card>
                        <CardContent className="py-4">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-muted-foreground">Total Retries:</span>
                                        <span className="font-semibold">
                                            {retryPatterns.slice(1).reduce((sum, p) => sum + p.count, 0).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-border" />
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-green-500" />
                                        <span className="text-sm text-muted-foreground">Recovery Rate:</span>
                                        <span className="font-semibold text-green-500">
                                            {((retryPatterns.slice(1).reduce((sum, p) => sum + (p.count * p.eventualSuccessRate / 100), 0) /
                                                retryPatterns.slice(1).reduce((sum, p) => sum + p.count, 0)) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="h-4 w-px bg-border hidden sm:block" />
                                    <div className="flex items-center gap-2 hidden sm:flex">
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        <span className="text-sm text-muted-foreground">Avg Attempts:</span>
                                        <span className="font-semibold">2.1</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Retry Patterns</CardTitle>
                            <CardDescription>How users retry after failures</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Attempt #</TableHead>
                                        <TableHead className="text-right">Users</TableHead>
                                        <TableHead className="text-right">Eventual Success</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {retryPatterns.map((pattern) => (
                                        <TableRow key={pattern.attempts}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {pattern.attempts === 1 ? "First try only" : `${pattern.attempts} attempts`}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{pattern.count.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                {pattern.attempts === 1 ? (
                                                    <span className="text-muted-foreground">N/A</span>
                                                ) : (
                                                    <span className={pattern.eventualSuccessRate >= 60 ? "text-green-500" : "text-yellow-500"}>
                                                        {pattern.eventualSuccessRate}%
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {pattern.attempts === 1 ? (
                                                    <Badge variant="outline">No retry</Badge>
                                                ) : (
                                                    <Badge
                                                        variant={pattern.eventualSuccessRate >= 60 ? "default" : "secondary"}
                                                        className={pattern.eventualSuccessRate >= 60 ? "bg-green-500/10 text-green-500" : ""}
                                                    >
                                                        {pattern.eventualSuccessRate >= 60 ? "Good recovery" : "Low recovery"}
                                                    </Badge>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
